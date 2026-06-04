const express = require("express");
const axios = require("axios");
const cors = require("cors");
const PDFDocument = require("pdfkit");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/analyze/:username", async (req, res) => {
  try {
    const username = req.params.username;

    // Fetch user profile
    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const user = response.data;
    let profileCompleteness = 0;

if (user.bio) profileCompleteness += 20;
if (user.location) profileCompleteness += 20;
if (user.company) profileCompleteness += 20;
if (user.email) profileCompleteness += 20;
if (user.blog) profileCompleteness += 20;

    // Fetch repositories
    const repoResponse = await axios.get(
      `https://api.github.com/users/${username}/repos`
    );

    const repos = repoResponse.data;

    // Total Stars
    let totalStars = 0;

    repos.forEach((repo) => {
      totalStars += repo.stargazers_count;
    });

    // Most Used Language
    const languageCount = {};

    repos.forEach((repo) => {
      if (repo.language) {
        languageCount[repo.language] =
          (languageCount[repo.language] || 0) + 1;
      }
    });

    let topLanguage = "Unknown";
    let maxCount = 0;

    for (const language in languageCount) {
      if (languageCount[language] > maxCount) {
        maxCount = languageCount[language];
        topLanguage = language;
      }
    }

    // Top Repository
    let topRepo = "None";
    let highestStars = 0;

    repos.forEach((repo) => {
      if (repo.stargazers_count > highestStars) {
        highestStars = repo.stargazers_count;
        topRepo = repo.name;
      }
    });

    // Activity Level
    let activity = "Low";

    if (repos.length > 20) {
      activity = "High";
    } else if (repos.length > 10) {
      activity = "Medium";
    }

    // Digital Footprint Score
    let score = 0;

    score += Math.min(user.followers, 100) * 0.3;
    score += Math.min(user.public_repos, 50) * 0.8;

    const accountAge =
      (Date.now() - new Date(user.created_at)) /
      (1000 * 60 * 60 * 24 * 365);

    score += accountAge * 5;

    score = Math.round(Math.min(score, 100));
    let tier = "Beginner";

if (score >= 90) {
  tier = "Elite Developer";
} else if (score >= 75) {
  tier = "Professional";
} else if (score >= 50) {
  tier = "Growing Developer";
}

    // Risk Level
    let riskLevel = "Low";

    if (user.followers < 10) {
      riskLevel = "High";
    } else if (user.followers < 50) {
      riskLevel = "Medium";
    }

    // Account Age
    const yearsOld = accountAge.toFixed(1);

    // AI Insight
    let insight = "";
    let recommendations = [];

    if (score >= 80) {
      insight = "Strong professional GitHub presence.";
    } else if (score >= 50) {
      insight = "Moderate online developer presence.";
    } else {
      insight = "Digital presence needs improvement.";
    }
if (user.public_repos < 10) {
  recommendations.push(
    "Create more public repositories to showcase your work."
  );
}

if (user.followers < 50) {
  recommendations.push(
    "Increase visibility by contributing to open-source projects."
  );
}

if (!user.bio) {
  recommendations.push(
    "Add a professional GitHub bio."
  );
}

if (totalStars < 20) {
  recommendations.push(
    "Improve documentation and project quality to attract stars."
  );
}

if (recommendations.length === 0) {
  recommendations.push(
    "Excellent profile. Maintain your current activity."
  );
}
    // Send response
    res.json({
      name: user.name,
      avatar: user.avatar_url,
      followers: user.followers,
      repos: user.public_repos,
      score,

      riskLevel,
      yearsOld,
      insight,

      totalStars,
      topLanguage,
      topRepo,
      activity,
      recommendations,
      tier,
      profileCompleteness,
      bio: user.bio,
      location: user.location,
      company: user.company,
      profile: user.html_url,
      createdAt: user.created_at
    });

  } catch (error) {
    res.status(500).json({
      error: "GitHub user not found"
    });
  }
});

app.get("/report/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const userResponse = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const user = userResponse.data;

    const repoResponse = await axios.get(
      `https://api.github.com/users/${username}/repos`
    );

    const repos = repoResponse.data;

    // Score Calculation
    let score = 0;

    score += Math.min(user.followers, 100) * 0.3;
    score += Math.min(user.public_repos, 50) * 0.8;

    const accountAge =
      (Date.now() - new Date(user.created_at)) /
      (1000 * 60 * 60 * 24 * 365);

    score += accountAge * 5;

    score = Math.round(Math.min(score, 100));

    // Tier
    let tier = "Beginner";

    if (score >= 90) {
      tier = "Elite Developer";
    } else if (score >= 75) {
      tier = "Professional";
    } else if (score >= 50) {
      tier = "Growing Developer";
    }

    // Total Stars
    let totalStars = 0;

    repos.forEach((repo) => {
      totalStars += repo.stargazers_count;
    });

    // Top Repository
    let topRepo = "None";
    let highestStars = 0;

    repos.forEach((repo) => {
      if (repo.stargazers_count > highestStars) {
        highestStars = repo.stargazers_count;
        topRepo = repo.name;
      }
    });

    // Top Language
    const languageCount = {};

    repos.forEach((repo) => {
      if (repo.language) {
        languageCount[repo.language] =
          (languageCount[repo.language] || 0) + 1;
      }
    });

    let topLanguage = "Unknown";
    let maxCount = 0;

    for (const language in languageCount) {
      if (languageCount[language] > maxCount) {
        maxCount = languageCount[language];
        topLanguage = language;
      }
    }

    // Create PDF
    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${username}-report.pdf`
    );

    doc.pipe(res);

    doc.fontSize(22)
      .text("DIGITAL FOOTPRINT ANALYSIS REPORT");

    doc.moveDown();

    doc.fontSize(14);

    doc.text(`Name: ${user.name || username}`);
    doc.text(`Score: ${score}`);
    doc.text(`Developer Tier: ${tier}`);

    doc.moveDown();

    doc.text(`Followers: ${user.followers}`);
    doc.text(`Repositories: ${user.public_repos}`);
    doc.text(`Total Stars: ${totalStars}`);

    doc.moveDown();

    doc.text(`Top Language: ${topLanguage}`);
    doc.text(`Top Repository: ${topRepo}`);

    doc.moveDown();

    doc.text(
      `Location: ${user.location || "Not Available"}`
    );

    doc.text(
      `Company: ${user.company || "Not Available"}`
    );

    doc.moveDown();

    doc.text("GitHub Profile:");
    doc.text(user.html_url);

    doc.moveDown();

    doc.text(
      "Generated by Digital Footprint Analyzer"
    );

    doc.end();

  } catch (error) {
    res.status(500).json({
      error: "PDF generation failed"
    });
  }
});
app.get("/languages/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const repoResponse = await axios.get(
      `https://api.github.com/users/${username}/repos`
    );

    const repos = repoResponse.data;

    const languageCount = {};

    repos.forEach((repo) => {
      if (repo.language) {
        languageCount[repo.language] =
          (languageCount[repo.language] || 0) + 1;
      }
    });

    const result = Object.keys(languageCount).map(
      (language) => ({
        name: language,
        value: languageCount[language]
      })
    );

    res.json(result);

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch language data"
    });
  }
});
app.get("/repos/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const repoResponse = await axios.get(
      `https://api.github.com/users/${username}/repos`
    );

    const repos = repoResponse.data;

    const result = repos
      .sort(
        (a, b) =>
          b.stargazers_count - a.stargazers_count
      )
      .slice(0, 5)
      .map((repo) => ({
        name: repo.name,
        stars: repo.stargazers_count
      }));

    res.json(result);

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch repository data"
    });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});