import webpush from 'web-push';
import { PRIVATE_VAPID_KEY, PUBLIC_VAPID_KEY } from '../config.js';

const wpush = webpush.setVapidDetails(
    'mailto:desarrollo@dotdcd.com',
    PUBLIC_VAPID_KEY,
    PRIVATE_VAPID_KEY
)

export { wpush };