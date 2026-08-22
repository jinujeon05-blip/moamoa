-- 회원 탈퇴: 로그인한 본인 계정을 직접 삭제할 수 있는 RPC
-- auth.users 삭제 시 profiles/receipt_batches는 on delete cascade로 자동 정리됨
-- (스토리지의 PDF 파일은 클라이언트에서 별도로 먼저 삭제)
create or replace function public.delete_own_account()
returns void as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function public.delete_own_account() to authenticated;
