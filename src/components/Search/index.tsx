import { useState } from 'react'
import './search.scss'
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Search = () => {
  const [textInput, setTextInput] = useState<string>('')

  return (
    <div className="wrap-search border border-1 rounded-[5px] overflow-hidden">
      <FontAwesomeIcon icon={faMagnifyingGlass} className="icon-search" />
      <input
        className="search-input"
        placeholder="Search"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
      />

      {textInput ? (
        <FontAwesomeIcon
          icon={faXmark}
          className="icon-clear"
          onClick={() => setTextInput('')}
        />
      ) : null}
    </div>
  )
}

export default Search
