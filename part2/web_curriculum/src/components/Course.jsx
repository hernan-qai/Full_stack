// Here the Course component is defined

import Header from "./Header"

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
}

export default Course