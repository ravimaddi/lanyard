import React, { Fragment, useState, useEffect } from "react"

import { navigate } from "gatsby"
import _ from "lodash"
import Loader from "../Loader"
import {
  eventCard,
  event_logo,
  event_title,
  event_timer,
  logoHeader,
  contentCard,
  card_now_text,
  card_event_title,
  card_end_time,
  contentSwipe,
  card_last_Row,
  car_speakers,
  card_profile,
  ratingCard,
  largeRating,
  end_info,
} from "./EventCardEmotion"

import star_on from "../../images/star-on.svg"
import star_off from "../../images/star-off.svg"

import { px_bg, form_row } from "../jss/cvcss"
import CountDown from "./CountDown"
import event_logo_img from "../../images/aws_logo.svg"
import { timeFormat } from "../../helpers/TimeStamp"

const EventCard = () => {
  const [eventStarted, setEventStarted] = useState(null)
  const [currentEvent, setCurrentEvent] = useState(null)
  const [nextEvent, setNextEvent] = useState(null)
  const [eventTime, setEventTime] = useState(null)
  const [fullTitle, setFullTitle] = useState(false)
  const [slots, setSlots] = useState([])
  const [stars, setStars] = useState([1, 2, 3, 4, 5])

  useEffect(() => {
    setSlots(JSON.parse(localStorage.getItem("slots")))
  }, [])

  function setTimingFunction() {
    setInterval(() => {
      if (slots.length) {
        setEventTime(slots[0].timeStart)
        if (
          _.now() > slots[0].timeStart &&
          _.now() < slots[slots.length - 1].timeEnd
        ) {
          setEventStarted("started")
        } else if (_.now() > slots[slots.length - 1].timeEnd) {
          setEventStarted("ended")
        } else {
          setEventStarted("notStarted")
        }
      }
      slots.map((slot, i) => {
        if (slot.timeStart <= _.now() && slot.timeEnd >= _.now()) {
          setCurrentEvent(slot)
          setNextEvent(slots[i + 1])
        }
      })
    }, 1000)
  }

  setTimingFunction()
  console.log(nextEvent)
  return (
    <div
      css={[eventCard, px_bg]}
      className={eventStarted !== "notStarted" ? "blurry" : " "}
    >
      {eventStarted === "started" ? (
        <Fragment>
          <div css={logoHeader}>
            <div css={event_logo}>
              <img src={event_logo_img} alt="event_logo" />
            </div>
            <div css={event_title}>
              <p>
                AWS Community Day <br />
                <small>Bengaluru - 2019</small>
              </p>
            </div>
          </div>
          {currentEvent ? (
            <Fragment>
              <div
                css={contentSwipe}
                className={`${
                  currentEvent.eventType === "break" ? "break" : "def"
                } ${currentEvent.tracks.length > 1 ? "multiple" : "single"}`}
              >
                {currentEvent.tracks.map((track, index) => (
                  <div
                    css={contentCard}
                    className={
                      track.selectedFlag === "selected"
                        ? track.selectedFlag
                        : " "
                    }
                    key={index}
                  >
                    <div>
                      {currentEvent.tracks.length > 1 ? (
                        <h4 css={card_now_text} className="card_now_text">
                          <span>{`Track - ${index + 1}`}</span>{" "}
                          {track.selectedFlag === "selected" ? (
                            <small>This is in your schedule</small>
                          ) : null}
                        </h4>
                      ) : null}
                      <h2
                        css={card_event_title}
                        className={`card_event_title ${
                          fullTitle ? "open" : "close"
                        }`}
                        onClick={() => setFullTitle(!fullTitle)}
                      >
                        <p>{track.title}</p>
                      </h2>
                    </div>
                    {currentEvent.eventType !== "talk" ? (
                      <div className={`illust  ${currentEvent.img}`}></div>
                    ) : null}
                    {track.speakers && track.speakers.length && (
                      <div
                        css={car_speakers}
                        className="car_speakers"
                        className="speaker"
                      >
                        {track.speakers.map((speaker, idx) => (
                          <div
                            css={card_profile}
                            className="card_profile"
                            key={idx}
                          >
                            <span className="profimg">
                              <img
                                src={speaker.profilePicture}
                                alt={speaker.firstName}
                              />
                            </span>{" "}
                            <span>{speaker.firstName}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {currentEvent.eventType !== "break" ? (
                      <div css={card_last_Row} className="card_last_Row">
                        <span css={ratingCard} className="stars">
                          {stars.map(star => (
                            <img src={star_off} key={star} />
                          ))}
                        </span>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
              <h5 css={card_end_time} className="card_end_time">
                Ends at {timeFormat(currentEvent.timeEnd + 1000)}
              </h5>
            </Fragment>
          ) : null}
        </Fragment>
      ) : eventStarted === "notStarted" ? (
        <Fragment>
          <div css={event_logo}>
            <img src={event_logo_img} alt="event_logo" />
          </div>
          <div css={event_title}>
            <p>
              AWS Community Day <br />
              <small>Bengaluru - 2019</small>
            </p>
          </div>
          <div css={event_timer}>
            <CountDown startingTime={eventTime} />
          </div>
        </Fragment>
      ) : eventStarted === "ended" ? (
        <Fragment>
          <div css={event_logo}>
            <img src={event_logo_img} alt="event_logo" />
          </div>
          <div css={event_title}>
            <p>
              AWS Community Day <br />
              <small>Bengaluru - 2019</small>
            </p>
          </div>
          <div css={end_info}>
            <label>
              Event has ended. Help us improve by providing feedback
            </label>
            <span
              navigate={"/"}
              css={[ratingCard, largeRating]}
              className="stars"
            >
              {stars.map(star => (
                <img src={star_off} key={star} />
              ))}
            </span>
          </div>
        </Fragment>
      ) : (
        <Loader />
      )}
    </div>
  )
}

export default EventCard
