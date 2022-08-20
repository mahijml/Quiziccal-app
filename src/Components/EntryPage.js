import React from 'react'

function EntryPage({startHandling}) {
  return (
    <div className='entry'>
        <h2 className='entry-title'>Quiz App </h2>
        <h5 className='entry-subtitle'>Test your knowledge</h5>
        <button className='btn' onClick={startHandling}>Start Quiz</button>
    </div>
  )
}

export default EntryPage