import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as Database from './db'
import * as Https from './https'


// credentials are populated when in Google's server environment
admin.initializeApp()


export const database = Database
export const https = Https
