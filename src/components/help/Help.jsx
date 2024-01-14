import React, { useState } from "react";
import "./help.css";
import TextField from "@mui/material/TextField";
import { Alert, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Cancel } from "@mui/icons-material";
import axios from "axios";

const Help = ({ setHelp , feedback }) => {
  const API = process.env.REACT_APP_API;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState(feedback ? "query" : "bug");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    formData.append("from_name", username);
    formData.append("from_email", email);
    formData.append("to_name", "Triloki Nath");
    formData.append("text", message);
    formData.append("image", image);

    try {
      const res = await axios.post(`${API}mail/send-mail`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data);
      setCompleted(true);
    } catch (error) {
      console.error("Error occurred. " + error.message);
      setError("An error occurred while sending the email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="helpContainer">
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(e, newMode) => setMode(newMode)}
      >
        <ToggleButton
          value="bug"
          size="small"
          style={{
            backgroundColor: mode === "bug" ? "#1976D2" : undefined,
            color: mode === "bug" ? "#fff" : undefined,
          }}
        >
          Bug Report
        </ToggleButton>
        <ToggleButton
          value="query"
          size="small"
          style={{
            backgroundColor: mode === "query" ? "#1976D2" : undefined,
            color: mode === "query" ? "#fff" : undefined,
          }}
        >
          Feedback
        </ToggleButton>
      </ToggleButtonGroup>

      <form className="formContainer" onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={username}
          variant="outlined"
          required
          size="small"
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Email"
          value={email}
          variant="outlined"
          required
          size="small"
          onChange={(e) => setEmail(e.target.value)}
        />

        {mode === "bug" && (
            <input
              type="file"
              id="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              style={{}}
            />
        )}

        <TextField
          label="Message"
          value={message}
          multiline
          rows={4}
          required
          size="small"
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          disabled={loading}
        >
          Send
        </Button>
      </form>

      <Cancel className="closeHelp" onClick={() => setHelp(false)} />

      {completed && (
        <Alert severity="success" onClose={() => setCompleted(false)}>
          Email sent successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
    </div>
  );
};

export default Help;
