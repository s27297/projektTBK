///events	Tworzenie i zarządzanie wydarzeniami
// /events/{id}	Edytowanie i usuwanie wydarzeń
// /events/{id}/attendees	Dodawanie i usuwanie uczestników wydarzeń
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


/*
//get group of a user(id of a user w body)
router.get('/',EventsController.getMessages)

//add group z 1 userem(id usera w body)
router.post('/', MessagesController.getMessages)

//edit group (id group w path,new users,deleted users,name in body)
router.put('/:id', MessagesController.getMessages)


//delete group (id group w path)
router.delete('/:id', MessagesController.getMessages)

 */