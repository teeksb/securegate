# SecureGate — Reflection & Engineering Analysis
**Name:** [Your full name]
**Cohort:** Design to MVP Bootcamp
**Live URL:** [Your Vercel deployment link]
**GitHub Repo:** [Your repo URL]
---
## Part 1 — Where in SecureGate did Murphy's Law force you to add protection you would not have thought about otherwise? Name at least two specific places and explain what could have gone wrong?

[
    1.In src/app/api/auth/signup/route.ts : Line 30 Password was hashed with bycryptjs with salt rounds of 12 so that if at all the database is leaked it will take a hacker longer to crack the passwords hashed.

    2.In src/app/auth/login-forrm.tsx by returning the same error message for both incorrect email and wrong password, it prevents hackers from being able to check if an email exists or not. This was added as "IMPORTANT" in the forgot password flow of the task brief and I did my research on the benefit.
 ]


## Part 2 — What Surprised Me
[The one thing that was harder than expected, and what you learned from it]


## Part 3 — Engineering Laws Quiz
### Q1 — Murphy's Law
**Code reference:** `src/app/api/auth/[...nextauth]/route.ts` lines 34-48
**My Answer:** [Your answer here]
**What goes wrong if ignored:** [Your answer here]
### Q2 — Law of Leaky Abstractions
... [repeat this pattern for all 15 questions]
## Part