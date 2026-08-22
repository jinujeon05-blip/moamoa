alter table public.receipt_batches
  add column category text not null default '기타';
