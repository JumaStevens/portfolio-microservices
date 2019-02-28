import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
const express = require('express')
const cors = require('cors')

// create express instance
const app = express()

// automatically allow cross-origin requests
app.use(cors({ origin: true }))





// add comment to blog database collection
const addComment = async ({ id, text, uid, username }) => {
  try {
    const data = { id, text, uid, username }

    return await admin.firestore()
      .collection('blog')
      .doc(id)
      .collection('comments')
      .add(data)
  }
  catch (e) {
    console.error(e)
    throw e
  }
}


// add sub comment to blog database collection
const addSubComment = async ({ id, text, uid, username, commentId }) => {
  try {
    const data = { id, text, uid, username }

    return await admin.firestore()
      .collection('blog')
      .doc(id)
      .collection('comments')
      .doc(commentId)
      .collection('subComments')
      .add(data)
  }
  catch (e) {
    console.error(e)
    throw e
  }
}


// handle referral code validation request
app.post('/', async (req, res) => {
  try {
    console.log('--> req data: ', req.body.data)

    const {
      text,
      handle,
      uid,
      username,
      id,
      commentId
    } = req.body.data

    const comment = await addComment({ id, text, uid, username })

    // need to create commentId for this to work
    // const subComment = await addSubComment({ id, text, uid, username, commentId })


    res.status(200).send('call worked')
  }
  catch (e) {
    console.error('catch error: ', e)
    res.status(400).send('Error: A wild Error appeared!')
  }
})


// https://us-central1-feed-me-sugar.cloudfunctions.net/https-blogComment
export const listener = functions.https.onRequest(app)
