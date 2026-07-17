export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  publishedAt: string;
  category: string;
  readingTime: string;
  excerpt: string;
  content: string; // Markdown or plain text with paragraphs
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "cracking-the-technical-interview",
    title: "Cracking the Technical Interview: A Structured Approach",
    author: "CareerSaathi Coaching Team",
    publishedAt: "2026-07-15",
    category: "Interview Prep",
    readingTime: "5 min read",
    excerpt: "Learn how to structure your coding explanations, whiteboard effectively, and handle difficult technical problems under pressure.",
    content: `Technical interviews can be daunting. But success is less about memorizing 500 LeetCode problems and more about having a structured approach. Here is the framework our coaches recommend for solving any technical challenge:

### 1. Understand and Clarify
Before you write a single line of code, repeat the problem back to the interviewer in your own words. Ask clarifying questions:
- What are the input constraints (size, range, types)?
- Are there memory or execution limits?
- How should we handle empty or invalid inputs?

### 2. Design the Algorithm
Talk out loud. Outline a brute-force approach first. Even if it is slow, it shows you can solve the problem. Then, discuss optimizations. Explain why a hash map or two-pointer approach reduces time complexity.

### 3. Translate to Code
Write clean, readable code. Use descriptive variable names. Keep your functions small and modular. If you need a helper function (like sorting), write the signature first and fill it in later.

### 4. Dry Run and Test
Walk through your code with a small sample input. Trace the values of variables step-by-step. This is where most candidates catch off-by-one errors or logical bugs before the interviewer points them out.`,
  },
  {
    slug: "crafting-impactful-resume-bullet-points",
    title: "Crafting High-Impact Resume Bullet Points using the STAR Method",
    author: "Sarah Jenkins, Lead Coach",
    publishedAt: "2026-07-10",
    category: "Resume Building",
    readingTime: "4 min read",
    excerpt: "Stop writing simple task descriptions. Learn how to highlight achievements and quantify results to impress hiring managers.",
    content: `Many resumes fail because they read like a list of chores rather than achievements. Hiring managers want to know the impact of your actions, not just what you did. The most effective way to frame your experience is the STAR method:

### Situation, Task, Action, Result

For each bullet point, try to weave in these components:
- **Situation/Task**: The context or challenge you faced.
- **Action**: What *you* did to resolve it.
- **Result**: The positive outcome of your actions, quantified with metrics.

### Before vs. After Examples

- **Before**: "Responsible for writing unit tests and fixing bugs."
- **After**: "Designed and implemented a comprehensive Jest test suite, increasing code coverage from 45% to 88% and reducing production bugs by 32%."

- **Before**: "Helped design the new landing page."
- **After**: "Co-engineered Stripe-integrated billing landing page, implementing responsive CSS which lifted conversion rates by 12%."`,
  },
  {
    slug: "leveraging-ai-in-your-job-search",
    title: "How to Leverage AI in Your Job Search Responsibly",
    author: "CareerSaathi AI Team",
    publishedAt: "2026-07-05",
    category: "Career Strategy",
    readingTime: "6 min read",
    excerpt: "AI is a powerful assistant, but copy-pasting generic covers won't cut it. Learn the strategy to use AI tools as high-fidelity partners.",
    content: `AI tools have changed job hunting. Candidates can now generate cover letters and polish resumes in seconds. However, generic AI outputs are easily spotted by hiring managers. The key is using AI as a high-fidelity partner rather than an automated script.

### 1. Tailor, Don't Copypaste
A standard, generic cover letter generated from a prompt like "Write a cover letter for a software engineer role" sounds robotic. Instead, feed the AI specific stories, achievements, and technical details from your background, and ask it to map those specific points to the job description.

### 2. Maintain Your Authentic Voice
Review every sentence. Make sure it sounds like you. If a word or phrase feels unnatural, change it. AI is excellent at structure and suggestion, but the authenticity must come from you.

### 3. Practice Active Conversations
Instead of just asking AI to generate static text, use interactive mock interview coaches. Respond out loud or type full answers, and study the constructive feedback to build real muscle memory.`,
  },
];
