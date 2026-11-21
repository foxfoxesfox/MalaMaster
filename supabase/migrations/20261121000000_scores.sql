-- Shared top-10 board. Anyone can read; writes only go through submit_score, which keeps 10 rows.
create table public.scores (
  id bigint generated always as identity primary key,
  name text not null check (char_length(btrim(name)) between 1 and 16),
  score int not null check (score between 1 and 500),
  created_at timestamptz not null default now()
);

alter table public.scores enable row level security;

create policy "Anyone can read the board" on public.scores for select to anon, authenticated using (true);

create function public.submit_score(p_name text, p_score int)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.scores (name, score) values (btrim(p_name), p_score);
  delete from public.scores
  where id not in (select id from public.scores order by score desc, created_at asc limit 10);
end;
$$;

revoke all on function public.submit_score(text, int) from public;
grant execute on function public.submit_score(text, int) to anon, authenticated;
