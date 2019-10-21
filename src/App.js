import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import Moment from "react-moment";
// import slider from './components/slider'
import Modal from "react-modal";
import YouTube from "react-youtube";
import "./App.css";

import {
  NavDropdown,
  Button,
  Navbar,
  Nav,
  Form,
  FormControl,
  Card
} from "react-bootstrap";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

const API_KEY = "2b5cc1182a9cf40c96817935d0c4c3ac";

function Navv(props) {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand className="navbar-brandd" href="#home">
        IMDB
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link
            className="navbar-brandd"
            onClick={props.reload}
            href="#home"
          >
            Home
          </Nav.Link>

          <NavDropdown
            className="navbar-brandd"
            title="Category"
            id="basic-nav-dropdown"
          >
            Category
            {props.genres.map(genre => {
              return (
                <NavDropdown.Item onClick={() => props.onclickSearch(genre.id)}>
                  {genre.name}
                </NavDropdown.Item>
              );
            })}
          </NavDropdown>
        </Nav>
        <Form inline onChange={e => props.apples(e.target.value)}>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button onClick={props.btn} variant="outline-success">
            Search
          </Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
}

function App() {
  const [movies, setMovies] = useState([]);
  const [clone, setClone] = useState([]);
  const [page, setLoadPage] = useState(1);
  const [genres, setGenre] = useState([]);
  const [query, setQuery] = useState("");
  const [ratingVal, setRatingVal] = useState({ min: 0, max: 10 });
  const [datingVal, setDatingVal] = useState({ min: 2000, max: 2019 });

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [keyVideo, setKeyVideo] = useState(null);

  const getGenre = async () => {
    let url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
    let response = await fetch(url);
    let data = await response.json();
    setGenre(data.genres);
  };

  const getData = async () => {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`;
    let response = await fetch(url);
    let data = await response.json();
    let newMovies = clone.concat(data.results);
    setMovies(newMovies);
    setClone(newMovies);
    setLoadPage(page + 1);
  };

  const reload = () => {
    window.location.reload();
  };
  const searchMovies = async () => {
    if (!query.trim()) return;
    else {
      let url = `https://api.themoviedb.org/3/search/collection?api_key=${API_KEY}&language=en-US&query=${query}&pages=1`;
      let response = await fetch(url);
      let data = await response.json();
      // console.log("data", data);
      setMovies(data.results);
    }
  };

  const genreSearch = async id => {
    // filter by id
    //clone
    const newarr = clone.filter(el => el.genre_ids.includes(id));
    setMovies(newarr);
  };

  useEffect(() => {
    getData();
    getGenre();
  }, []);

  const onRatingSliderChange = val => {
    const newMovies = clone.filter(movie => {
      const isAboveMinimumRating = movie.vote_average > val.min;
      const isBelowMaximumRating = movie.vote_average < val.max;
      return isAboveMinimumRating && isBelowMaximumRating;
    });
    // console.log('newMovies',val)
    setMovies(newMovies);
    setRatingVal(val);
  };



  const onDatingSliderChange = val => {
    const Dating = clone.filter(movie => {
      const yearRate = movie.release_date.slice(0,4)
      const isAboveMinimumDating = yearRate > val.min;
      const isBelowMaximumDating = yearRate < val.max;
      
      return isAboveMinimumDating && isBelowMaximumDating;
    });
    setMovies(Dating);
    setDatingVal(val);
  };

  //toggle tat mo modal
  //getvideo
  function toggle(id) {
    if (!isOpenModal) getVideo(id);
    setIsOpenModal(!isOpenModal);
  }

  const getVideo = async id => {
    const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`;
    const response = await fetch(url);
    const data = await response.json();
    setKeyVideo(
      data.results[Math.floor(Math.random() * data.results.length)].key
    );
  };

  console.log(keyVideo);
  return (
    <div className="App">
      <Modal isOpen={isOpenModal} onRequestClose={toggle} style={customStyles}>
        <YouTube
          videoId={keyVideo} // defaults -> null
          id={keyVideo} // defaults -> null
        />
      </Modal>
      <Navv
        genres={genres}
        reload={reload}
        onclickSearch={genreSearch}
        apples={setQuery}
        btn={() => searchMovies()}
      />

      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-3 navbar-genre mt-5">
            <InputRange
              className="mt-3"
              maxValue={10}
              minValue={0}
              value={ratingVal}
              onChange={value => onRatingSliderChange(value)}
            />
            <div className="text-center rating-text">Rating</div>
            <hr></hr>
            <InputRange
              className="mt-3"
              maxValue={2019}
              minValue={2000}
              value={datingVal}
              onChange={value => onDatingSliderChange(value)}
            />
            <div className="text-center rating-text">Year</div>
          </div>
          <div className="row col-12 col-md-9 list-movies">
            {movies.map(movie => {
              return (
                <div className="col-md-4">
                  <div class="flip-card">
                    <div class="flip-card-inner">
                      <div class="flip-card-front">
                        <Card.Img
                          variant="top"
                          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                        />
                      </div>
                      <div class="flip-card-back">
                        <Card.Body>
                          <Card.Title>{movie.title}</Card.Title>
                          <Card.Text>{movie.overview}</Card.Text>
                          <div>Release Date: {movie.release_date}</div>
                          <div>
                            Rate: {movie.vote_average} / 10 ({movie.vote_count}{" "}
                            IMDb)
                          </div>
                          <Button
                            variant="primary"
                            onClick={() => {
                              toggle(movie.id);
                            }}
                          >
                            Trailer
                          </Button>
                        </Card.Body>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <button
          className="btn btn-outline-primary mt-3"
          onClick={() => getData()}
        >
          Load More
        </button>
      </div>
    </div>
  );
}

export default App;
