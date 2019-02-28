import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'


// database
import * as Database from './db'


// https
import * as Https from './https'


// initialize firebase admin
admin.initializeApp()


// export database
export const database = Database


// export https
export const https = Https
