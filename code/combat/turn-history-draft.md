- moves are rolsoved and their outcomes saved onto the hisstory
- history is replicated to all connected users
    - replicated to other players
    - replicated to spectatttors
- history items may contain flags
    - a flag may be silent to certain groups of users
        - i.e. a player does not need to replay the rolling that they made


- history is updated to everyone
    - each update 

# Sample History
turn X, Player A

> phase: resolve 
1. [EVENT] doing move: `move-id`
2. [ANIM] play`animation-id`
3. [ROLL-REQUEST] roll a `dice-format` (only Player A gets an options menu)
4. [ROLL-RESULT] rolled a `roll-outcome`
5. [NOTICE] success
> phase: outcome
6. [ANIM] play `animation-id`
7. [DAMAGE] `target` takes `damage`
# JSON vers.
```json
{
  "Player A":
  {
    "phase-resolve":
    [
      {
        "type": "notice",
        "msg": "Used move {move-id}."
      },
      {
        "type": "play-anim",
        "anim-id": "animation-id",
        "loop": "once"
      },
      {
        "type": "roll-request",
        "dice": "d20"
      },
      {
        "type": "roll-result",
        "result": "17/20"
      },
      {
        "type": "notice",
        "msg": "{move-id} was successful."
      }
    ],
    "phase-outcome":
    [
      {
        "type": "play-anim",
        "anim-id": "animation-id",
        "loop": "once"
      },
      {
        "type": "damage",
        "target": "target",
        "amount": "damage"
      }
    ]
  }
}
```