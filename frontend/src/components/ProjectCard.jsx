import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProjectCard.css';

const ProjectCard = ({ project }) => {
  const { _id, title, description, imageUrl, repoUrl, liveUrl } = project;

  return (
    <div className="project-card">
      {imageUrl && (
        <div className="project-image">
          <img src={imageUrl} alt={title} />
        </div>
      )}
      
      <div className="project-info">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>
        
        <div className="project-links">
          {repoUrl && (
            <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="project-link repo">
              查看代码
            </a>
          )}
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="project-link live">
              在线演示
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;