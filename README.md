# Rizzly Frontend
A dating platform written in Typescript using React, Redux Toolkit, and React Router.

## What sets Rizzly apart?
Modern dating apps matchmake users based on the relative success of in-app interactions. This adds an unfair skew to the app, where people are encouraged to take very attractive (and sometimes
non-representative) photos, and are not rewarded for positive in-person interactions.

Rizzly flips this idea on its head, with three main adjustments:
1. People are matched into balanced "rooms" where everyone on one side of a room is theoretically a match for everyone on the other side.
2. Rooms are created between people with roughly equal scores;
3. Scores are based entirely on in-person interactions -- your date ends up reporting their relative satisfaction.

The goal was for the platform to integrate in-person interactions much more closely into the recommendation engine, producing a safer, healthier and more satisfying app.

What did I learn?
1. There is still quite a bit of demand for new dating apps, despite the relative saturation of the market.
2. Vastly different people are interested in the app depending on location. For instance, mostly men looking for long-term relationships signed up to the app at Dartmouth, and mostly women
looking for short-term relationships signed up at UVM.
3. Crossing the initial network threshold required for the app to work for anyone was very difficult. For instance, at Dartmouth I had do get more than 50 sign-ons before I was able to create
the first room. For this reason, the selection algorithm (which I thought was one of the great strengths of the app), ended up being a weakness.
