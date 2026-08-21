-- 정리된 A4 PDF를 저장할 비공개 스토리지 버킷
insert into storage.buckets (id, name, public)
values ('receipt-pdfs', 'receipt-pdfs', false)
on conflict (id) do nothing;

-- 파일 경로 규칙: {user_id}/{batch_id}.pdf → 첫 폴더명으로 소유자 확인
create policy "receipt_pdfs_select_own" on storage.objects
  for select using (bucket_id = 'receipt-pdfs' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "receipt_pdfs_insert_own" on storage.objects
  for insert with check (bucket_id = 'receipt-pdfs' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "receipt_pdfs_delete_own" on storage.objects
  for delete using (bucket_id = 'receipt-pdfs' and auth.uid()::text = (storage.foldername(name))[1]);

-- 정리 내역에 PDF 경로 컬럼 추가
alter table public.receipt_batches add column pdf_path text;
