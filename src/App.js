import React, { Component } from 'react';

import Film from './components/Film';
import Counter from './components/Counter';
import Person from './components/Person';

import classes from './App.module.css'

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      people: [],
      count: 0,
      linkSource: 'https://swapi.co/api/people/',
      maxCount: 100,
      genderCount: {
        male: 0,
        female: 0,
        middle: 0
      },
      filmInfo: {
        actors: [],
        name: ''
      }
    }
  }

  // Получение персонажей

  getPeople = (str) => {
    fetch(str)
      .then(
          response => response.json())
      .then(data => {

        let dataArr = [], // массив записываемых значений
            countItems = 0, // счетчик числа записываемых значений
            countSlice = 0; // количество значений для отсечения

        // Сравнение с максимумом получаемых значений

        if (((this.state.count + data.results.length) < this.state.maxCount) || ((this.state.count + data.results.length) === this.state.maxCount))
        {
          dataArr = data.results.slice(0);
          countItems = data.results.length;
        }
        else if ((this.state.count + data.results.length) > this.state.maxCount)
        {
          countItems = countSlice = data.results.length - ((this.state.count + data.results.length) - this.state.maxCount);
          dataArr = data.results.slice(0, data.results.length - countSlice + 1);
        }

        this.setState(prevState => ({
          people: [ ...prevState.people, ...dataArr],
          count: prevState.count + countItems,
          linkSource: data.next
        }));
      });
  };

  // Гендерный счетчик

  getGenderCount = () => {
    let genderCount = {
      male: 0,
      female: 0,
      middle: 0
    };

    const people = this.state.people.slice();

    people.forEach(peopleItem => {
      if (peopleItem.gender === "male") {
        genderCount.male++;
      }
      else if (peopleItem.gender === "female") {
        genderCount.female++;
      }
      else if (peopleItem.gender === "n/a") {
        genderCount.middle++;
      }
    });

    this.setState(() => (
      {
        genderCount: {
          male: genderCount.male,
          female: genderCount.female,
          middle: genderCount.middle
        }
      })
    );
  };

  // Получение фильма с масимальным количеством актеров из списка

  getFilm = () => {
    let films = [],
      max = 0,
      item = 0;

    const people = this.state.people.slice();

    people.forEach(person => {
      person.films.forEach(film => {
        let posLast = film.lastIndexOf('/', film.length - 2),
          numberFilm = film.substring(posLast + 1, film.length - 1);

        if (films[numberFilm]) {
          films[numberFilm].count += 1;
          films[numberFilm].actors.push(person.name);
        } else {
          films[numberFilm] = {
            count: 1,
            actors: [person.name]
          };
        }
      });
    });

    films.forEach((film, index) => {
      if (film.count > max) {
        max = film.count;
        item = index;
      }
    });

    console.log(films[item].actors);

    fetch('https://swapi.co/api/films/'+ item +'/')
      .then(
          response => response.json())
      .then(data => {

        this.setState({
          filmInfo: {
            actors: films[item].actors,
            name: data.title
          }
        })
      });
  };


  componentDidMount() {
    this.getPeople(this.state.linkSource);
  }

  componentDidUpdate(prevProps, prevState) {
    const count = this.state.people.length;

    if (count !== prevState.people.length) {
      if (this.state.linkSource && this.state.count < this.state.maxCount) {
        this.getGenderCount();
        this.getPeople(this.state.linkSource);
      } else {
        this.getFilm();
      }
    }
  }

  render() {
    let peopleList = this.state.people.map((peopleItem, index) => <Person key={index} personInfo={peopleItem} />);

    return (
      <div className={classes.block}>
        <div className={classes.left}>
          <div className={classes.list}>
            { peopleList }
          </div>
        </div>
        <div className={classes.right}>
          <Counter male={this.state.genderCount.male} female={this.state.genderCount.female}  middle={this.state.genderCount.middle} />
          <Film filmInfo={this.state.filmInfo} />
        </div>
      </div>
    );
  }
}

export default App;
