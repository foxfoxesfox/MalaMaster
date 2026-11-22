-- Orders became a 60-second shift scored in points (≈2,000 for a perfect shift), not a 5-order round out of 500.
alter table public.scores drop constraint scores_score_check;
alter table public.scores add constraint scores_score_check check (score between 1 and 5000);
