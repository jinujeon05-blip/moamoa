-- 프로필 테이블: 사용자당 1행, auth.users와 1:1 연결
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- 회원가입 시 자동으로 프로필 행 생성
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, split_part(new.email, '@', 1), new.email);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 영수증 정리 내역 (마이페이지 활동 내역)
create table public.receipt_batches (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  batch_date date not null default current_date,
  receipt_count int not null default 0,
  total_amount numeric not null default 0,
  created_at timestamptz default now()
);

alter table public.receipt_batches enable row level security;

create policy "receipt_batches_select_own" on public.receipt_batches
  for select using (auth.uid() = user_id);

create policy "receipt_batches_insert_own" on public.receipt_batches
  for insert with check (auth.uid() = user_id);

create policy "receipt_batches_update_own" on public.receipt_batches
  for update using (auth.uid() = user_id);

create policy "receipt_batches_delete_own" on public.receipt_batches
  for delete using (auth.uid() = user_id);
