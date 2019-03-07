import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import validator from 'validator'
import { uniqueNamesGenerator } from 'unique-names-generator'
import badWords from 'bad-words'


const generateUsername = () => {
  const randomName = uniqueNamesGenerator()
  return randomName
}


const badWordsFilter = new badWords()

const scrubText = (text) => {
  const cleanText = badWordsFilter.clean(text)
  return cleanText
}


const blogIdLookUp = async ({ handle }) => {
  try {
    let id = false

    const querySnapshot = await admin.firestore()
      .collection('blogs')
      .where('handle', '==', handle)
      .limit(1)
      .get()

    querySnapshot.forEach(doc => id = doc.id)

    return id
  }
  catch (e) {
    console.error(e)
    throw e
  }
}


const createBlogComment = async (comment) => {
  try {
    return await admin.firestore()
      .collection('blogComments')
      .add(comment)
  }
  catch (e) {
    console.error(e)
    throw e
  }
}


const cleanUpQueue = async (queueCommentId) => {
  try {
    return await admin.firestore()
      .collection('queueBlogCommentsCreate')
      .doc(queueCommentId)
      .delete()
  }
  catch (e) {
    console.error(e)
    throw e
  }
}


const doc = functions.firestore.document('queueBlogCommentsCreate/{queueCommentId}')

export const listener = doc.onCreate(async (snap, context) => {
  try {
    const data = snap.data()
    console.log('data: ', data)

    const serverTimestamp = admin.firestore.FieldValue.serverTimestamp()
    const username = generateUsername()
    const text = scrubText(data.text)
    const blogId = await blogIdLookUp({ handle: data.handle })

    const commentData = {
      createdAt: serverTimestamp,
      updatedAt: '',
      username,
      uid: data.uid, // database security rules validate uid
      text,
      blogId,
      parentCommentId: data.parentCommentId ? data.parentCommentId : ''
    }

    console.log('commentData: ', commentData)
    await createBlogComment(commentData)
    await cleanUpQueue(context.params.queueCommentId)

    return
  }
  catch (e) {
    console.error('queueBlogCommentsCreate error: ', e)
    return
  }
})
