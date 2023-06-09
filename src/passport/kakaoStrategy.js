import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

export default () => {
  passport.use(
    'kakao',
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.findOne({
            where: { social_id: profile.id, provider: 'kakao' },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              nickname: profile.displayName,
              social_id: profile.id,
              provider: 'kakao',
              access_token: accessToken,
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
