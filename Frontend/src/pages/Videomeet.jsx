//new and updated
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./Videomeet.css";
import "tailwindcss";

// Material UI
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import Navbar from "./Navbar";
import server from "../environment.js"





const server_url = server;
const connections = {};
const peerConfig = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// -------------------- LOBBY VIDEO (NO BLINKING) --------------------
const LobbyVideoPreview = ({ stream }) => {
  const videoRef = useRef();

  // Attach the stream only once
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video ref={videoRef} autoPlay muted playsInline className="lobby-video" />
  );
};

// -------------------- MEETING VIDEO TILE --------------------
const VideoTile = ({ video }) => {
  const videoRef = useRef();

  // Attach the stream only once
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = video.stream;
    }
  }, [video.stream]);

  return (
    <div className="video-tile">
      
      
      <video ref={videoRef} autoPlay playsInline muted={video.isLocal} />
      <div className="video-name">
        
        {video.isLocal ? "You" : `User: ${video.socketId}`}
        
      </div>
    </div>
  );
};

export default function Videomeet() {
  const socketRef = useRef();
  const socketIdRef = useRef();
  const [videos, setVideos] = useState([]);

  // --------------------- USER INFO ---------------------
  const [username, setUsername] = useState("");
  const [askForUsername, setAskForUsername] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  // --------------------- CHAT STATE ---------------------
  const [chatVisible, setChatVisible] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef([]);
  const chatEndRef = useRef();

  // --------------------- GET MEDIA PERMISSION ---------------------
  const getPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      window.localStream = stream;
      setVideos([{ socketId: "local", stream, isLocal: true }]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPermission();
  }, []);

  // --------------------- SIGNAL HANDLER ---------------------
  const gotMessageFromServer = async (fromId, message) => {
    const signal = JSON.parse(message);
    if (fromId === socketIdRef.current) return;

    const peer = connections[fromId];
    if (!peer) return;

    if (signal.sdp) {
      await peer.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      if (signal.sdp.type === "offer") {
        const description = await peer.createAnswer();
        await peer.setLocalDescription(description);
        socketRef.current.emit(
          "signal",
          fromId,
          JSON.stringify({ sdp: peer.localDescription })
        );
      }
    }

    if (signal.ice) {
      await peer.addIceCandidate(new RTCIceCandidate(signal.ice));
    }
  };

  // --------------------- CONNECT TO SOCKET ---------------------
  const connectToSocketServer = () => {
    socketRef.current = io.connect(server_url);
    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", {path:window.location.href,name:username});
      socketIdRef.current = socketRef.current.id;

      // User left
      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((v) => v.socketId !== id));
      });

      // User joined
      socketRef.current.on("user-joined", (id, clients) => {//changes
        clients.forEach((socketListId) => {
          if (connections[socketListId]) return;

          const peer = new RTCPeerConnection(peerConfig);
          connections[socketListId] = peer;

          // ICE candidates
          peer.onicecandidate = (event) => {
            if (event.candidate) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          // Remote stream handling
          peer.ontrack = (event) => {
            setVideos((prev) => {
              const exists = prev.find((v) => v.socketId === socketListId);
              if (exists) return prev;

              return [
                ...prev,
                {
                  socketId: socketListId,
                  stream: event.streams[0],
                  isLocal: false,
                },
              ];
            });
          };

          // Add local tracks
          if (window.localStream) {
            window.localStream.getTracks().forEach((track) => {
              peer.addTrack(track, window.localStream);
            });
          }
        });

        // Create offers for existing peers
        if (id === socketIdRef.current) { 
          Object.keys(connections).forEach(async (id2) => {
            if (id2 === socketIdRef.current) return;
            const peer = connections[id2];
            if (!peer.localDescription) {
              const description = await peer.createOffer();
              await peer.setLocalDescription(description);
              socketRef.current.emit(
                "signal",
                id2,
                JSON.stringify({ sdp: peer.localDescription })
              );
            }
          });
        }
      });

      // Chat listener
      socketRef.current.on("chat-message", (data, sender) => {
        messagesRef.current = [...messagesRef.current, { sender, data }];
        setMessages([...messagesRef.current]);
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    });
  };

  // --------------------- CONNECT BUTTON ---------------------
  const connect = () => {
    if (!username.trim()) return;
    setAskForUsername(false);
    connectToSocketServer();
  };

  // --------------------- TOGGLE MIC & CAMERA ---------------------
  const toggleMic = () => {
    window.localStream.getAudioTracks()[0].enabled = !micOn;
    setMicOn(!micOn);
  };

  const toggleCamera = () => {
    window.localStream.getVideoTracks()[0].enabled = !cameraOn;
    setCameraOn(!cameraOn);
  };

  // --------------------- LEAVE CALL ---------------------
  const leaveCall = () => {
    window.localStream.getTracks().forEach((track) => track.stop());
    window.location.reload();
  };

  // --------------------- TOGGLE SCREEN SHARE ---------------------
  const toggleScreenShare = async () => {
    if (!screenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        const track = stream.getVideoTracks()[0];

        Object.values(connections).forEach((peer) => {
          const sender = peer
            .getSenders()
            .find((s) => s.track.kind === "video");
          if (sender) sender.replaceTrack(track);
        });

        track.onended = () => toggleScreenShare();
        window.localStream = stream;
        setScreenSharing(true);
      } catch (err) {
        console.log(err);
      }
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      window.localStream = stream;

      Object.values(connections).forEach((peer) => {
        const sender = peer.getSenders().find((s) => s.track.kind === "video");
        if (sender) sender.replaceTrack(stream.getVideoTracks()[0]);
      });

      setScreenSharing(false);
    }
  };

  const toggleChat = () => setChatVisible(!chatVisible);

  // --------------------- SEND MESSAGE ---------------------
  const sendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    socketRef.current.emit("chat-message", chatMessage, username);
    messagesRef.current = [
      ...messagesRef.current,
      { sender: "You", data: chatMessage },
    ];
    setMessages([...messagesRef.current]);
    setChatMessage("");
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // --------------------- RENDER ---------------------
  return (
    <div className="videomeet-wrapper">
        <Navbar/>
    
      {askForUsername ? (
        <div className="lobby-screen">
          <h2 className="lobby-title">Join Meeting</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="lobby-input"
          />
          <button className="lobby-button" onClick={connect}>
            Connect
          </button>

          {/* --------------------- LOBBY VIDEO PREVIEW --------------------- */}
          <div className="video-preview">
            {videos.find((v) => v.isLocal) && (
              <LobbyVideoPreview
                stream={videos.find((v) => v.isLocal).stream}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="meeting-wrapper">
          <div
            className={`video-grid-wrapper ${chatVisible ? "chat-open" : ""}`}
          >
            {/* --------------------- MEETING VIDEOS --------------------- */}
            <div
              className={`video-grid ${chatVisible ? "video-chat-active" : ""}`}
            >
              {videos.map((video) => (
                <VideoTile key={video.socketId} video={video} />
              ))}
            </div>

            {/* --------------------- CONTROL BAR --------------------- */}
            <div className="control-bar">
              <IconButton onClick={toggleMic} className="control-button">
                {micOn ? <MicIcon /> : <MicOffIcon />}
              </IconButton>
              <IconButton onClick={toggleCamera} className="control-button">
                {cameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>
              <IconButton
                onClick={toggleScreenShare}
                className="control-button"
              >
                <ScreenShareIcon />
              </IconButton>
              <IconButton onClick={toggleChat} className="control-button">
                <ChatIcon />
              </IconButton>
              <IconButton onClick={leaveCall} className="control-button leave">
                <CallEndIcon />
              </IconButton>
            </div>

            {/* --------------------- CHAT --------------------- */}
            {chatVisible && (
              <div className="chat-container">
                <div className="chat-header">Chat</div>
                <div className="chat-messages">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`chat-message ${
                        msg.sender === "You" ? "my-message" : "other-message"
                      }`}
                    >
                      <span className="chat-username">{msg.sender}:</span>{" "}
                      {typeof msg.data === "object"
                        ? JSON.stringify(msg.data)
                        : msg.data}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form className="chat-input" onSubmit={sendMessage}>
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button type="submit">Send</button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
