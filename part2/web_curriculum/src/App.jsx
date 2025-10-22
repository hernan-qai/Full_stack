// Here the App component is defined

import Course from "./components/Course"
/*const Header = (props) => <h1>{props.course}</h1>

const Course = (props) => {
  const { course } = props
  return (
    <div>
      <Header course={course.name} />
      <ul>
        {course.parts.map(part => (
          <li key={part.id}>
            {part.name} {part.exercises}
          </li>
        ))}
      </ul>
      <p>Total number of exercises : {course.parts.reduce((sum, part) => sum + part.exercises, 0)}</p>
    </div>
  )
}*/

const App = () => {
  const course = [
    {
    id:1,
    name: 'Half Stack application development',
    parts: [
      {
        name : 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name : 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name : 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises : 11,
        id: 4
      },
      {
        name: 'React Router',
        exercises : 7,
        id: 5
      }
    ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middleware',
          exercises: 7,
          id: 2
        },
        {
          name: 'MongoDB',
          exercises: 9,
          id: 3
        }
      ]
    },
    {
      name: 'Full Stack application development',
      id: 3,
      parts: [
        {
          name: 'GraphQL',
          exercises: 7,
          id: 1
        },
        {
          name: 'Apollo Client',
          exercises: 11,
          id: 2
        },
        {
          name: 'React Testing Library',
          exercises: 14,
          id: 3
        }
      ]
    }
  ]

  return (
    <div>
      {course.map((c) => (
        <Course key={c.id} course={c} />
      ))}
    </div>
  )

}

export default App