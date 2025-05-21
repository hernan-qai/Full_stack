// Header Component
const Header = ({course}) => {
  console.log({course});
  return <h1>{course}</h1>;
};

// Part Components
const Part1 = ({ part }) => {
  console.log({part});
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
}

const Part2 = ({ part }) => {
  console.log({part});
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
}

const Part3 = ({ part }) => {
  console.log({part});
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
}
// Content Component
const Content = ({parts}) => {
  console.log({parts});
  return (
    <div>
      <Part1 part={parts[0]} />
      <Part2 part={parts[1]} />
      <Part3 part={parts[2]} />  
      </div>
  )
}

// Total Component
const Total = ({ exercises }) => {
  const total = exercises.reduce((sum, num) => sum + num, 0);
  return <p>Number of exercises {total}</p>;
}

// App Component
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total exercises={course.parts.map(part => part.exercises)} />
    </div>
  )
}
// Exporting the App component

export default App;
