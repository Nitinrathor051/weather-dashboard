import { useEffect, useState } from "react";
import API from "../services/api";
import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

import "../styles/global.css";
import "../styles/dashboard.css";

function Dashboard() {
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  // messages
  const [msg, setMsg] = useState("");

  // AI STATES
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const navigate = useNavigate();

  // FETCH
  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await API.get("/cities");
      setCities(res.data || []);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // ADD CITY (UPDATED WITH MESSAGE HANDLING)
  const addCity = async () => {
    const trimmed = city.trim();
    if (!trimmed) return;

    setAdding(true);
    setMsg("");

    try {
      await API.post("/cities", { cityName: trimmed });

      setCity("");
      setMsg("City added successfully");

      fetchCities();
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong");
    }

    setAdding(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addCity();
  };

  // FAVORITE
  const toggleFavorite = async (id) => {
    try {
      await API.put(`/cities/favorite/${id}`);
      fetchCities();
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE
  const deleteCity = async (id) => {
    try {
      await API.delete(`/cities/${id}`);
      fetchCities();
    } catch (err) {
      console.log(err);
    }
  };

  // AI
  const askAI = async () => {
    const q = question.trim();
    if (!q) return;

    setAiLoading(true);
    setAiAnswer("");

    try {
      const res = await API.post("/ai/ask", {
        question: q,
        cities: cities.map((c) => c.cityName),
      });

      setAiAnswer(res.data.answer);
    } catch (err) {
      setAiAnswer("AI Error");
    }

    setAiLoading(false);
  };

  const handleAIKeyDown = (e) => {
    if (e.key === "Enter") askAI();
  };

  return (
    <div className="dashboard">

      {/* TOP BAR */}
      <div className="topbar">
        <h2>Weather Dashboard</h2>

        <button
          className="logout"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

      {/* INPUT */}
      <div className="inputBox">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter city name..."
        />

        <button onClick={addCity} disabled={adding}>
          {adding ? "Adding..." : "Add City"}
        </button>
      </div>

      {/* MESSAGE */}
      {msg && <p className="msg">{msg}</p>}

      {/* AI BOX */}
      <div className="aiBox">
        <h3>AI Assistant</h3>

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleAIKeyDown}
          placeholder="Ask anything about weather..."
        />

        <button onClick={askAI} disabled={aiLoading}>
          {aiLoading ? "Thinking..." : "Ask"}
        </button>

        {aiAnswer && (
          <div className="aiResponse">{aiAnswer}</div>
        )}
      </div>

      {/* LOADING */}
      {loading && <p className="loading">Loading...</p>}

      {/* EMPTY */}
      {!loading && cities.length === 0 && (
        <p className="empty">No cities added</p>
      )}

      {/* GRID */}
      <div className="grid">
        {cities.map((c) => (
          <div className="card" key={c._id}>
            <h3>{c.cityName}</h3>

            {c.weather && (
              <>
                <p>{c.weather.temperature}°C</p>
                <p>{c.weather.description}</p>
              </>
            )}

            <button onClick={() => toggleFavorite(c._id)}>
              {c.isFavorite ? "Unfavorite" : "Favorite"}
            </button>

            <button className="delete" onClick={() => deleteCity(c._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Dashboard;