# Deliverable Packaging

Do **not** commit binary archives (`.tar.gz`) to this repository because some review/update UIs reject binary diffs.

To generate a source bundle locally when needed, run:

```bash
git archive --format=tar.gz -o The-Chakra-source.tar.gz HEAD backend frontend
```

This produces an archive containing only the tracked `backend` and `frontend` trees at the current commit.
