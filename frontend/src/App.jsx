const BASE_URL =
  "https://digital-footprint-analyzer-production.up.railway.app";
import "./App.css";
import { useState } from "react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

function App() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [repoChartData, setRepoChartData] =
  useState([]);
  const [loading, setLoading] = useState(false);

  const analyzeUser = async () => {
  try {
    setLoading(true);

    // Main analysis data
    const response = await axios.get(
      `${BASE_URL}/analyze/${username}`
    );

    setData(response.data);

    // Language chart data
    const languageResponse =
      await axios.get(
        `${BASE_URL}/languages/${username}`
      );

    setChartData(
      languageResponse.data
    );
    const repoResponse =
  await axios.get(
    `${BASE_URL}/repos/${username}`
  );

setRepoChartData(
  repoResponse.data
);
  } catch (error) {
    alert("GitHub user not found");
  } finally {
    setLoading(false);
  }
};

return (
  <div className="container">

    <h1 className="title">
  AI-Powered Digital Footprint Analyzer
</h1>
<button
  onClick={() =>
    document.body.classList.toggle("dark")
  }
>
  Toggle Dark Mode
</button>
<p className="subtitle">
  Enter your GitHub username to receive a complete
  digital footprint analysis, profile score,
  developer tier, and personalized recommendations.
</p>
    <div className="search-box">
      <input
        type="text"
        placeholder="GitHub Username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

      <button onClick={analyzeUser}>
  Analyze My Profile
</button>
    </div>

{loading && (
  <h2>Analyzing Digital Footprint...</h2>
)}

    {data && (
      <>
        <div className="profile">
          <img
            src={data.avatar}
            alt="avatar"
            width="120"
          />

          <h2>{data.name}</h2>
        <button
  onClick={() =>
    window.open(
      `http://localhost:5000/report/${username}`,
      "_blank"
    )
  }
>
  Download Report
</button>
<a
  href={data.profile}
  target="_blank"
  rel="noreferrer"
>
  <button>
    View GitHub Profile
  </button>
</a>

          <p>{data.bio}</p>
        </div>

        <div className="cards">

          <div className="card">
            <h3>Score</h3>
            <p>{data.score}</p>
          </div>

          <div className="card">
  <h3>Developer Tier</h3>
  <p>{data.tier}</p>
</div>
<div className="card">
  <h3>Profile Completeness</h3>
  <p>{data.profileCompleteness}%</p>
</div>

          <div className="card">
            <h3>Followers</h3>
            <p>{data.followers}</p>
          </div>

          <div className="card">
            <h3>Repositories</h3>
            <p>{data.repos}</p>
          </div>

          <div className="card">
            <h3>Risk Level</h3>
            <p>{data.riskLevel}</p>
          </div>

          <div className="card">
  <h3>Total Stars</h3>
  <p>{data.totalStars}</p>
</div>

<div className="card">
  <h3>Top Language</h3>
  <p>{data.topLanguage}</p>
</div>

<div className="card">
  <h3>Activity</h3>
  <p>{data.activity}</p>
</div>

<div className="card">
  <h3>Account Age</h3>
  <p>{data.yearsOld}y</p>
</div>
        </div>

        <div className="insight">
          <h3>AI Insight</h3>

          <p>{data.insight}</p>

        <p>
  <strong>Top Repository:</strong>{" "}
  {data.topRepo}
</p>
      
        <div className="recommendations">
  <h3>Recommendations</h3>

  <ul>
    {data.recommendations.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
</div>

          <p>
            <strong>Location:</strong>{" "}
            {data.location}
          </p>

          <p>
            <strong>Company:</strong>{" "}
            {data.company}
          </p>

          <p>
            <strong>Account Age:</strong>{" "}
            {data.yearsOld} years
          </p>
          
        </div>
        <div className="chart-section">
  <h2>Language Distribution</h2>

  <PieChart width={500} height={350}>
    <Pie
      data={chartData}
      dataKey="value"
      nameKey="name"
      outerRadius={120}
      label
    />
    <Tooltip />
    <Legend />
  </PieChart>
</div>

{/* ADD THIS BELOW */}

<div className="chart-section">
  <h2>Your Top Repositories</h2>

  <BarChart
    width={700}
    height={300}
    data={repoChartData}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="stars" />
  </BarChart>
</div>

      </>
    )}

  </div>
);
}

export default App;
  
