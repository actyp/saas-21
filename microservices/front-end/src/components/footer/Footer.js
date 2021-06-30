import './Footer.css';

export default function Footer() {
  return (
    <footer>
      <div className="d-flex justify-content-around p-2">
        <a className="btn-link my-auto" href="https://" target="_blank" rel="noreferrer">
          <i className="fas fa-user-friends"> About</i>
        </a>

        <a className="btn-link my-auto" href="https://" target="_blank" rel="noreferrer">
          <i className="fas fa-envelope"> Contact us</i>
        </a>

        <a className="btn-link my-auto" href="https://" target="_blank" rel="noreferrer">
          <i className="fas fa-book"> Project Documentation</i>
        </a>

        <a className="btn-link my-auto" href="https://" target="_blank" rel="noreferrer">
          <i className="fab fa-github"> Github</i>
        </a>

        <a className="btn-link my-auto" href="https://" target="_blank" rel="noreferrer">
          <i className="fas fa-university"> Course Materials</i>
        </a>
      </div>
      <div className="text-center p-1 copyright" >
        © 2021 Copyright: AskMeAnything
      </div>
    </footer>
  );
}
