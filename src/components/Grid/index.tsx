import { useRef, useState } from "react";
import { duplicateRegenerateSortArray } from "../../utils/cards-utils";
import { Card, CardProps } from "../Card";
import './style.css'

export interface GridProps {
  cards: CardProps[]
}

export function Grid({cards}: GridProps){
  const [stateCards, setStateCards] = useState(()=>{
    return duplicateRegenerateSortArray(cards)
  });

  const first = useRef<CardProps | null>(null)
  const second = useRef<CardProps | null>(null)
  const unflip = useRef(false)
  const [matches, setMatches] = useState(0)
  const [moves, setMoves] = useState(0)

  const handleReset = ()=> {
    setStateCards(duplicateRegenerateSortArray(cards))
    first.current = null
      second.current = null
      unflip.current = false
      setMatches(0)
      setMoves(0)
  }

  const handleClick = (id: string) =>{
  const newStateCards = stateCards.map(card =>{

    //se o id do cartão não for o id clicado, não faz nada

    if(card.id != id) return card;

   // se o cartão já estiver virado, não faz nada

   if(card.flipped) return card;

   //Desvio possíveis cartas erradas
   if(unflip.current && first.current && second.current){
      first.current.flipped = false
      second.current.flipped = false
      first.current = null
      second.current = null
      unflip.current = false

   }

   // virar o card

   card.flipped = true;

   //Configurar primeiro esse cartão clicados

   if(first.current === null){
    first.current = card
   }else if(second.current === null){
    second.current = card
   }


    // se eu tenho os dois cartãoes virados, posso checar se estão os dois corretos

    if(first.current && second.current){
      if(first.current.back === second.current.back){
        //a pessoa acertou
        first.current= null
        second.current = null
      setMatches(m=>m+1)

      }else{
        //A pessoa errou
        unflip.current = true
      }
      setMoves(m=>m+1)
    }
    return card
  })

  setStateCards(newStateCards)
}

  return (
  <>
  <div className="header">
    <div className="text">
      <h1>
        <span className="logo">Nephews<span className="subLogo">Memory Game</span></span>
      </h1>
      <div className="pontos">
  <p>Tentativas:<h2>{moves}</h2></p>
  <p>Combinações:<h2>{matches}</h2></p>
    </div>
  <div className="points">
  <button onClick={()=> handleReset()}>Novo Jogo</button>
  </div>
  </div>

  </div>
  <div className="grid">
    {stateCards.map((card) =>{
     return <Card {...card} key={card.id} handleClick={handleClick} />
    })}
  </div>
  </>
  )
}
