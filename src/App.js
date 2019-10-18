import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
// import slider from './components/slider'
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

const API_KEY = "2b5cc1182a9cf40c96817935d0c4c3ac";

function Navv(props) {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">IMDB</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#link">Link</Nav.Link>
          
          <NavDropdown title="Category" id="basic-nav-dropdown">
              Category
              {props.genres.map(genre => {
                return (
                  <NavDropdown.Item onClick={() => props.onclickSearch(genre.id)} >{genre.name}</NavDropdown.Item>
                );
              })}
            </NavDropdown>
          
          
        </Nav>
        <Form inline onChange={e => props.apples(e.target.value)}>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button onClick={props.btn} type="submit" variant="outline-success">
            Search
          </Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
}

function App() {
  const [state, setState] = useState([]);
  const [clone, setClone] = useState([]);
  const [page, setLoadPage] = useState(1);
  const [genres, setGenre] = useState([]);

  const [query, setQuery] = useState("");

  console.log('12',genres)

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
    let newMovies = state.concat(data.results);
    setState(newMovies);
    setClone(newMovies)
    setLoadPage(page + 1);
  };

  const searchMovies = async () => {
    if (!query.trim()) return;
    else {
      let url = `https://api.themoviedb.org/3/search/collection?api_key=${API_KEY}&language=en-US&query=${query}&pages=1`;
      let response = await fetch(url);
      let data = await response.json();
      setState(data.results);
    }
  };

  const genreSearch= async (id)=>{
    // filter by id
    //clone
    const newarr = clone.filter(el => el.genre_ids.includes(id))
    setState(newarr)
  }

  useEffect(() => {
    getData();
    getGenre();
  }, []);
  return (
    <div className="App">
      <Navv genres = {genres}  onclickSearch={genreSearch}   apples={setQuery} btn={() => searchMovies()} />

      <div className="container-fluid">
        <div className="row">
          <div className="col-3 col-md-3 navbar-genre">
    

          </div>
          <div className="row col-9 col-md-9 list-movies">

            {state.map(movies => {
              return (
                <div className="col-md-4 mt-2">
                  <Card style={{ width: "18rem" }}>
                    <Card.Img
                      variant="top"
                      src={`https://image.tmdb.org/t/p/w500/${movies.poster_path}`}
                    />
                    <Card.Body>
                      <Card.Title>{movies.title}</Card.Title>
                      <Card.Text>{movies.overview}</Card.Text>
                      <div>Release Date: {movies.release_date}</div>
                      <div>
                        Rate: {movies.vote_average} / 10 ({movies.vote_count}{" "}
                        IMDb)
                      </div>
                      <Button variant="primary">Go somewhere</Button>
                    </Card.Body>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
        <Button onClick={() => getData()} variant="primary">
          Load More
        </Button>
      </div>
    </div>
  );
}

export default App;
