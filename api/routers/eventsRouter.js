///events	Tworzenie i zarządzanie wydarzeniami
// /events/{id}	Edytowanie i usuwanie wydarzeń
// /events/{id}/attendees	Dodawanie i usuwanie uczestników wydarzeń
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const EventsController = require('../controllers/eventsController.js');
const {authenticate} = require("../auth/authMiddleware.js");


router.use(authenticate);
//get all events(jezeli id of a user w body to tylko jego eventy)
router.get('/',EventsController.getEvents);

//add event (name,date oraz text in body)
router.post('/', EventsController.addEvent);

//edit event (name,date oraz text in body)
router.put('/:id', EventsController.editEvent)

//edit members in event (id in path,member in body)
router.patch('/:id/attendees', EventsController.editParticipants)

//delete event (id in path)
router.delete('/:id', EventsController.deleteEvent)

module.exports = router;