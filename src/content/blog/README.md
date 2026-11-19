Seven posts migrate with their original slugs under /blog/ (the 301 map handles the old root-level URLs).

Nash: open each source_url, copy the article body into the matching .md file, keep the H3s as ### headings, delete the "By Update First Last..." byline, and set description to the post's current meta description. Two content fixes while you are in there:
- "3 Reasons to Consider Granite" says granite "naturally resists stains"; "3 Things to Consider" says granite "requires regular sealing". Edit the granite post to say it resists stains when sealed.
- Every post ends with a generic "contact us" paragraph; keep one sentence and link it to /#contact.

Status, Nov 19: all seven bodies were migrated from the live site with the rules above applied and are marked `status: MIGRATED_NEEDS_REVIEW`. They build and publish as they are. Nash: read each one against its source_url, then change the status to `published`. Internal links in the bodies were kept and pointed at the new URLs. Statistics quoted in the posts (Grand View Research, Fixr, HomeAdvisor) were copied as written and have not been checked.
