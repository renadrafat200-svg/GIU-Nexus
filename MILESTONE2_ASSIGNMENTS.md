# GIU Nexus - Milestone 2 Team Assignments

Here is the complete distribution of the 28 API endpoints and 3 AI integrations across your 10 team members. Each person is responsible for creating the necessary routes and controllers for their assigned endpoints, as well as testing them with Postman.

## 🧑‍💻 Teammate 1 (Team Lead): Core Auth & Email
**Responsibilities:** Setup Nodemailer, Password Reset Flow, and PR Reviews.
- Set up `services/emailService.js` (Nodemailer config)
- **POST** `/api/v1/auth/forgot-password` (Generate token, save to user, send email)
- **PATCH** `/api/v1/auth/reset-password/:token` (Verify token, update password)
- *Team Lead Duty:* Review all Pull Requests from the team before merging to `main`.

## 🧑‍💻 Teammate 2: Basic Authentication
**Responsibilities:** Registration and Login flows with JWT.
- **POST** `/api/v1/auth/register` (Hash password, set role/status, return JWT)
- **POST** `/api/v1/auth/login` (Verify password, return JWT)
- **POST** `/api/v1/auth/logout` (Stateless logout)

## 🧑‍💻 Teammate 3: Profile & Skill Extraction (AI)
**Responsibilities:** User profile management and the first Hugging Face AI integration.
- **GET** `/api/v1/profile` (Get logged-in user profile)
- **PATCH** `/api/v1/profile` (Update name, bio, etc.)
- **PATCH** `/api/v1/profile/change-password` (Change password while logged in)
- **POST** `/api/v1/profile/extract-skills` **[AI MODEL]** (Use `dslim/bert-base-NER` to extract skills from bio and save to profile)

## 🧑‍💻 Teammate 4: Job Posting & Classification (AI)
**Responsibilities:** Recruiter job creation and the second Hugging Face AI integration.
- **POST** `/api/v1/jobs` **[AI MODEL]** (Create job, use `facebook/bart-large-mnli` to auto-classify category based on description)
- **PATCH** `/api/v1/jobs/:id` (Update job. If description changes, re-run AI classification)
- **DELETE** `/api/v1/jobs/:id` (Recruiter/Admin deletes job)

## 🧑‍💻 Teammate 5: Job Searching & Recommendations (AI)
**Responsibilities:** Public job browsing and the third Hugging Face AI integration.
- **GET** `/api/v1/jobs` (Get all jobs, handle pagination and filtering: keyword, location, type, status)
- **GET** `/api/v1/jobs/recommended` **[AI MODEL]** (Use `sentence-transformers/all-MiniLM-L6-v2` to calculate cosine similarity between user skills and open jobs)
- **GET** `/api/v1/jobs/:id` (Get a single job post by ID)

## 🧑‍💻 Teammate 6: Job Saving & Recruiter Dashboards
**Responsibilities:** Job seeker bookmarks and recruiter's job list.
- **GET** `/api/v1/jobs/my-jobs` (Recruiter gets their own posts)
- **GET** `/api/v1/jobs/saved` (Job seeker gets their bookmarked jobs)
- **POST** `/api/v1/jobs/:id/save` (Job seeker toggles saving/unsaving an open job)

## 🧑‍💻 Teammate 7: Applications (Job Seeker Side)
**Responsibilities:** Applying to jobs and viewing application history.
- **POST** `/api/v1/jobs/:jobId/apply` (Job seeker submits application, check for duplicates)
- **GET** `/api/v1/applications/my` (Job seeker gets all their applications with populated job details)

## 🧑‍💻 Teammate 8: Applications (Recruiter Side)
**Responsibilities:** Reviewing applications and updating statuses.
- **GET** `/api/v1/jobs/:jobId/applicants` (Recruiter gets all applications for their specific job)
- **PATCH** `/api/v1/applications/:id/status` (Recruiter updates application status to pending/shortlisted/rejected)

## 🧑‍💻 Teammate 9: Admin - User Management
**Responsibilities:** Admin privileges for managing platform users.
- **GET** `/api/v1/users` (Admin gets all users, handle filtering by role and status)
- **GET** `/api/v1/users/:id` (Admin gets a single user by ID)
- **PATCH** `/api/v1/users/:id/status` (Admin approves/rejects pending recruiters)
- **DELETE** `/api/v1/users/:id` (Admin deletes a user)

## 🧑‍💻 Teammate 10: Admin - Stats & Platform Overview
**Responsibilities:** Complex MongoDB aggregations and platform-wide application viewing.
- **GET** `/api/v1/admin/stats` (Use MongoDB aggregation `$group` and `$sort` to get platform stats: usersByRole, jobsByStatus, appsByStatus, topJobs)
- **GET** `/api/v1/applications` (Admin gets paginated list of all applications on the platform)

---

### Workflow Reminders for the Team:
1. **Never commit the `.env` file**. Use `.env.example` instead.
2. **Setup Postman**: Every teammate must test their endpoints in Postman and take a screenshot before creating a Pull Request.
3. **One Branch per Feature**: e.g., `git checkout -b feature/auth-endpoints`
4. **Hugging Face Token**: The `hfService.js` must be initialized once as a singleton. Teammates 3, 4, and 5 will import it into their controllers.
5. All route controllers should use the centralized error handler (`next(err)`).
