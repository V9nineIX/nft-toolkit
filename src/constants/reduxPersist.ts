/*
    60sec = 1mins ==> 30sec = (60sec * 30)=1800 [DurationTime: 30mins]
    60sec = 1mins ==> 30sec = (60sec * 60)=3600 [DurationTime: 60mins = 1hour]
    60sec = 1mins ==> 30sec = (3600mins * 24)=86400 [DurationTime: 60mins = 24hour]
*/
// export const REDUX_STATE_EXPIRE: number = 1  // Test clear redux
export const REDUX_STATE_EXPIRE: number = 604800000 // 7Days