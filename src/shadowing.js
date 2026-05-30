// ── SHADOWING — Phrasal Verbs A2→B2 ─────────────────────────────────────────
// ~300 frasi di uso quotidiano, stile Friends / How I Met Your Mother
// Schema: { id, en, tag }
// tag: 'phrasal-a2' | 'phrasal-b1' | 'phrasal-b2'
// Tutte le frasi: massimo 10 parole

const SHADOW = [

  // ── PHRASAL A2 ───────────────────────────────────────────────────────────

  // wake up / get up
  { id:1,   en:"I woke up at seven and could not sleep.",                        tag:"phrasal-a2" },
  { id:2,   en:"Come on, wake up! We are going to be late.",                     tag:"phrasal-a2" },
  { id:3,   en:"She woke up in a great mood this morning.",                      tag:"phrasal-a2" },
  { id:4,   en:"I get up early every day, even on weekends.",                    tag:"phrasal-a2" },
  { id:5,   en:"He got up, made coffee, and sat by the window.",                 tag:"phrasal-a2" },

  // turn on / turn off
  { id:6,   en:"Can you turn on the lights? It is too dark.",                    tag:"phrasal-a2" },
  { id:7,   en:"Turn off the TV and come to bed.",                               tag:"phrasal-a2" },
  { id:8,   en:"I always turn my phone off during meetings.",                    tag:"phrasal-a2" },
  { id:9,   en:"She turned on the radio and started dancing.",                   tag:"phrasal-a2" },
  { id:10,  en:"Did you turn off the oven before you left?",                     tag:"phrasal-a2" },

  // give up
  { id:11,  en:"I gave up coffee and I feel so much better.",                    tag:"phrasal-a2" },
  { id:12,  en:"Do not give up. You are almost there.",                          tag:"phrasal-a2" },
  { id:13,  en:"She gave up her job to travel the world.",                       tag:"phrasal-a2" },
  { id:14,  en:"He wanted to give up but his friends said no.",                  tag:"phrasal-a2" },
  { id:15,  en:"Never give up on the things that make you smile.",               tag:"phrasal-a2" },

  // come back / go out
  { id:16,  en:"She came back from holiday looking really relaxed.",             tag:"phrasal-a2" },
  { id:17,  en:"I will be back in ten minutes, I promise.",                      tag:"phrasal-a2" },
  { id:18,  en:"Come back here, we need to talk.",                               tag:"phrasal-a2" },
  { id:19,  en:"Do you want to go out for dinner tonight?",                      tag:"phrasal-a2" },
  { id:20,  en:"We went out every night when we were in Rome.",                  tag:"phrasal-a2" },

  // put on / take off
  { id:21,  en:"Put on your jacket, it is freezing outside.",                    tag:"phrasal-a2" },
  { id:22,  en:"She put on some music and poured two glasses of wine.",          tag:"phrasal-a2" },
  { id:23,  en:"Take off your shoes before you come in.",                        tag:"phrasal-a2" },
  { id:24,  en:"The plane took off two hours late.",                             tag:"phrasal-a2" },
  { id:25,  en:"He took off his coat and sat down on the sofa.",                 tag:"phrasal-a2" },

  // pick up
  { id:26,  en:"Can you pick me up from the airport at nine?",                   tag:"phrasal-a2" },
  { id:27,  en:"I need to pick up some milk on my way home.",                    tag:"phrasal-a2" },
  { id:28,  en:"She picked up the phone and called him straight away.",          tag:"phrasal-a2" },
  { id:29,  en:"He picked up Spanish really quickly in Madrid.",                 tag:"phrasal-a2" },
  { id:30,  en:"Pick up your things and let us get out of here.",                tag:"phrasal-a2" },

  // look after / run out of
  { id:31,  en:"Can you look after my cat this weekend?",                        tag:"phrasal-a2" },
  { id:32,  en:"She looks after her little brother every afternoon.",            tag:"phrasal-a2" },
  { id:33,  en:"We ran out of coffee so I went to the shop.",                    tag:"phrasal-a2" },
  { id:34,  en:"My phone ran out of battery in the middle of the day.",          tag:"phrasal-a2" },
  { id:35,  en:"We are running out of time, hurry up.",                          tag:"phrasal-a2" },

  // calm down / cheer up
  { id:36,  en:"Calm down, everything is going to be fine.",                     tag:"phrasal-a2" },
  { id:37,  en:"She told him to calm down and explain.",                         tag:"phrasal-a2" },
  { id:38,  en:"Cheer up! It is not the end of the world.",                      tag:"phrasal-a2" },
  { id:39,  en:"I tried to cheer her up but she was not in the mood.",           tag:"phrasal-a2" },
  { id:40,  en:"He calmed down after a few minutes and apologized.",             tag:"phrasal-a2" },

  // fill in / put off
  { id:41,  en:"Can you fill in this form with your details?",                   tag:"phrasal-a2" },
  { id:42,  en:"Fill in the blanks with the correct verb form.",                 tag:"phrasal-a2" },
  { id:43,  en:"Stop putting things off and just do it.",                        tag:"phrasal-a2" },
  { id:44,  en:"We had to put off the meeting.",                                 tag:"phrasal-a2" },
  { id:45,  en:"She kept putting off calling him back.",                         tag:"phrasal-a2" },

  // grow up / slow down
  { id:46,  en:"I grew up in a small town but moved away.",                      tag:"phrasal-a2" },
  { id:47,  en:"Grow up! You cannot act like a child forever.",                  tag:"phrasal-a2" },
  { id:48,  en:"Slow down! You are going way too fast.",                         tag:"phrasal-a2" },
  { id:49,  en:"Can you slow down? I cannot keep up with you.",                  tag:"phrasal-a2" },
  { id:50,  en:"He grew up without a father. It was tough.",                     tag:"phrasal-a2" },

  // ── PHRASAL B1 ───────────────────────────────────────────────────────────

  // figure out
  { id:51,  en:"I cannot figure out how this thing works.",                      tag:"phrasal-b1" },
  { id:52,  en:"We need to figure out a plan before it is too late.",            tag:"phrasal-b1" },
  { id:53,  en:"She finally figured out what she wanted to do.",                 tag:"phrasal-b1" },
  { id:54,  en:"I am trying to figure out where I know him from.",               tag:"phrasal-b1" },
  { id:55,  en:"Just give me a minute, I will figure it out.",                   tag:"phrasal-b1" },

  // show up / turn up
  { id:56,  en:"He showed up an hour late without any explanation.",             tag:"phrasal-b1" },
  { id:57,  en:"She never showed up and did not even send a message.",           tag:"phrasal-b1" },
  { id:58,  en:"I cannot believe he actually showed up after everything.",       tag:"phrasal-b1" },
  { id:59,  en:"Guess who turned up at the party last night.",                   tag:"phrasal-b1" },
  { id:60,  en:"He turned up at her door with flowers and an apology.",          tag:"phrasal-b1" },

  // end up
  { id:61,  en:"We got lost and ended up on the wrong side.",                    tag:"phrasal-b1" },
  { id:62,  en:"She ended up staying for three hours instead of one.",           tag:"phrasal-b1" },
  { id:63,  en:"I did not plan to move here, I just ended up staying.",          tag:"phrasal-b1" },
  { id:64,  en:"They ended up getting married after just six months.",           tag:"phrasal-b1" },
  { id:65,  en:"He always ends up apologizing even when he is right.",           tag:"phrasal-b1" },

  // get along / get on with
  { id:66,  en:"Do you get along with your roommate?",                           tag:"phrasal-b1" },
  { id:67,  en:"We did not get along at first but now we are friends.",          tag:"phrasal-b1" },
  { id:68,  en:"She gets on really well with everyone at work.",                 tag:"phrasal-b1" },
  { id:69,  en:"I just cannot get on with him, we are too different.",           tag:"phrasal-b1" },
  { id:70,  en:"They get along fine unless they talk about money.",              tag:"phrasal-b1" },

  // let down
  { id:71,  en:"He really let me down when I needed him most.",                  tag:"phrasal-b1" },
  { id:72,  en:"I do not want to let you down, so I will try.",                  tag:"phrasal-b1" },
  { id:73,  en:"She felt let down when nobody came to her show.",                tag:"phrasal-b1" },
  { id:74,  en:"Promise me you will not let me down this time.",                 tag:"phrasal-b1" },
  { id:75,  en:"He let the whole team down by not preparing.",                   tag:"phrasal-b1" },

  // sort out
  { id:76,  en:"I need to sort out my finances by the end of the month.",        tag:"phrasal-b1" },
  { id:77,  en:"Can you sort out this mess while I am gone?",                    tag:"phrasal-b1" },
  { id:78,  en:"They sorted out their differences and moved on.",                tag:"phrasal-b1" },
  { id:79,  en:"Give me a day and I will sort everything out.",                  tag:"phrasal-b1" },
  { id:80,  en:"She is great at sorting out problems quickly.",                  tag:"phrasal-b1" },

  // look into / look up
  { id:81,  en:"I will look into it and get back to you tomorrow.",              tag:"phrasal-b1" },
  { id:82,  en:"Can you look into why the delivery is so late?",                 tag:"phrasal-b1" },
  { id:83,  en:"Look up the address before we leave.",                           tag:"phrasal-b1" },
  { id:84,  en:"I looked up his number but he never answered.",                  tag:"phrasal-b1" },
  { id:85,  en:"She looked up the word because she did not know it.",            tag:"phrasal-b1" },

  // set up
  { id:86,  en:"He set up his own business at the age of twenty-two.",           tag:"phrasal-b1" },
  { id:87,  en:"Can you set up a meeting for Thursday afternoon?",               tag:"phrasal-b1" },
  { id:88,  en:"They set up a charity to help homeless people.",                 tag:"phrasal-b1" },
  { id:89,  en:"She set up the whole event by herself in two days.",             tag:"phrasal-b1" },
  { id:90,  en:"I need help setting up my new phone.",                           tag:"phrasal-b1" },

  // keep up / catch up
  { id:91,  en:"I cannot keep up with everything that is happening.",            tag:"phrasal-b1" },
  { id:92,  en:"Keep up the good work and you will get that promotion.",         tag:"phrasal-b1" },
  { id:93,  en:"We should catch up soon, it has been ages.",                     tag:"phrasal-b1" },
  { id:94,  en:"She called to catch up after not speaking for months.",          tag:"phrasal-b1" },
  { id:95,  en:"I need to catch up on all the episodes I missed.",               tag:"phrasal-b1" },

  // break up / make up
  { id:96,  en:"They broke up after three years together.",                      tag:"phrasal-b1" },
  { id:97,  en:"He broke up with her over a text message.",                      tag:"phrasal-b1" },
  { id:98,  en:"They always argue but they always make up the next day.",        tag:"phrasal-b1" },
  { id:99,  en:"She made up a story to avoid going to the party.",               tag:"phrasal-b1" },
  { id:100, en:"They broke up and made up so many times.",                       tag:"phrasal-b1" },

  // hang out / hang up
  { id:101, en:"We used to hang out every weekend as teenagers.",                tag:"phrasal-b1" },
  { id:102, en:"Do you want to hang out later? I have nothing planned.",         tag:"phrasal-b1" },
  { id:103, en:"She hung up before I could say anything.",                       tag:"phrasal-b1" },
  { id:104, en:"Do not hang up! I need to tell you something.",                  tag:"phrasal-b1" },
  { id:105, en:"They just hang out, watch movies, and order pizza.",             tag:"phrasal-b1" },

  // drop by / check in
  { id:106, en:"Drop by any time, the door is always open.",                     tag:"phrasal-b1" },
  { id:107, en:"She dropped by without calling and we were not home.",           tag:"phrasal-b1" },
  { id:108, en:"We checked in to the hotel and went to the pool.",               tag:"phrasal-b1" },
  { id:109, en:"Check in online the night before the flight.",                   tag:"phrasal-b1" },
  { id:110, en:"He dropped by my office just to say hello.",                     tag:"phrasal-b1" },

  // work out
  { id:111, en:"She works out every morning before going to work.",              tag:"phrasal-b1" },
  { id:112, en:"I cannot work out why he said that.",                            tag:"phrasal-b1" },
  { id:113, en:"Things did not work out between them.",                          tag:"phrasal-b1" },
  { id:114, en:"It all worked out in the end. What a relief.",                   tag:"phrasal-b1" },
  { id:115, en:"We need to work out a solution for everyone.",                   tag:"phrasal-b1" },

  // come down with / sign up
  { id:116, en:"I think I am coming down with something.",                       tag:"phrasal-b1" },
  { id:117, en:"She came down with a cold before her presentation.",             tag:"phrasal-b1" },
  { id:118, en:"Sign up for the newsletter to get updates.",                     tag:"phrasal-b1" },
  { id:119, en:"I signed up for a yoga class and I love it.",                    tag:"phrasal-b1" },
  { id:120, en:"He signed up without reading the terms and conditions.",         tag:"phrasal-b1" },

  // go on / go for
  { id:121, en:"What is going on? You look upset.",                              tag:"phrasal-b1" },
  { id:122, en:"Just go on, I am listening.",                                    tag:"phrasal-b1" },
  { id:123, en:"She decided to go for the job even though it was a long shot.",  tag:"phrasal-b1" },
  { id:124, en:"Go for it! You have nothing to lose.",                           tag:"phrasal-b1" },
  { id:125, en:"I do not know what is going on with him lately.",                tag:"phrasal-b1" },

  // go off / break down
  { id:126, en:"My alarm went off and I just turned it off.",                    tag:"phrasal-b1" },
  { id:127, en:"The fire alarm went off in the middle of the night.",            tag:"phrasal-b1" },
  { id:128, en:"My car broke down and I had to call for help.",                  tag:"phrasal-b1" },
  { id:129, en:"She broke down in tears when she heard the news.",               tag:"phrasal-b1" },
  { id:130, en:"The negotiations broke down and both sides walked away.",        tag:"phrasal-b1" },

  // look forward to / put up with
  { id:131, en:"I am really looking forward to the weekend.",                    tag:"phrasal-b1" },
  { id:132, en:"She is looking forward to starting her new job.",                tag:"phrasal-b1" },
  { id:133, en:"I cannot put up with this noise any longer.",                    tag:"phrasal-b1" },
  { id:134, en:"How do you put up with him? He is so annoying.",                 tag:"phrasal-b1" },
  { id:135, en:"I look forward to hearing from you soon.",                       tag:"phrasal-b1" },

  // get rid of / bring up
  { id:136, en:"It is time to get rid of things you do not need.",               tag:"phrasal-b1" },
  { id:137, en:"I cannot get rid of this headache no matter what.",              tag:"phrasal-b1" },
  { id:138, en:"She was brought up by her grandparents in Italy.",               tag:"phrasal-b1" },
  { id:139, en:"Do not bring that up again, it is over.",                        tag:"phrasal-b1" },
  { id:140, en:"He was brought up to always say please and thank you.",          tag:"phrasal-b1" },

  // keep in touch / chill out
  { id:141, en:"Let us keep in touch. Send me a message when you arrive.",       tag:"phrasal-b1" },
  { id:142, en:"It is hard to keep in touch after you move away.",               tag:"phrasal-b1" },
  { id:143, en:"Just chill out. It is not a big deal.",                          tag:"phrasal-b1" },
  { id:144, en:"We just stayed home and chilled out all weekend.",               tag:"phrasal-b1" },
  { id:145, en:"She needs to chill out and stop worrying so much.",              tag:"phrasal-b1" },

  // depend on / pass out
  { id:146, en:"It all depends on what time you finish work.",                   tag:"phrasal-b1" },
  { id:147, en:"You can always depend on her when things get difficult.",        tag:"phrasal-b1" },
  { id:148, en:"He passed out from the heat and went to hospital.",              tag:"phrasal-b1" },
  { id:149, en:"She almost passed out when she heard the price.",                tag:"phrasal-b1" },
  { id:150, en:"Whether we go depends on the weather.",                          tag:"phrasal-b1" },

  // ── PHRASAL B2 ───────────────────────────────────────────────────────────

  // take over / take on
  { id:151, en:"A new manager took over the department last month.",             tag:"phrasal-b2" },
  { id:152, en:"She took over when the director resigned suddenly.",             tag:"phrasal-b2" },
  { id:153, en:"He took on too much work and completely burned out.",            tag:"phrasal-b2" },
  { id:154, en:"The company took on fifty new employees last year.",             tag:"phrasal-b2" },
  { id:155, en:"She took over the whole project and turned it around.",          tag:"phrasal-b2" },

  // carry out / cut out
  { id:156, en:"The team carried out a full investigation into the incident.",   tag:"phrasal-b2" },
  { id:157, en:"They carried out the plan exactly as discussed.",                tag:"phrasal-b2" },
  { id:158, en:"The doctor told him to cut out sugar and alcohol.",              tag:"phrasal-b2" },
  { id:159, en:"Cut it out! I am trying to concentrate.",                        tag:"phrasal-b2" },
  { id:160, en:"She cut out all the stress and felt much better.",               tag:"phrasal-b2" },

  // come up / come out
  { id:161, en:"Something came up and I could not make the meeting.",            tag:"phrasal-b2" },
  { id:162, en:"A problem came up that nobody had expected.",                    tag:"phrasal-b2" },
  { id:163, en:"The new season comes out next month. I cannot wait.",            tag:"phrasal-b2" },
  { id:164, en:"The truth came out and everything changed.",                     tag:"phrasal-b2" },
  { id:165, en:"I will let you know if anything comes up.",                      tag:"phrasal-b2" },

  // deal with
  { id:166, en:"I will deal with it tomorrow when I have more energy.",          tag:"phrasal-b2" },
  { id:167, en:"She is very good at dealing with difficult people.",             tag:"phrasal-b2" },
  { id:168, en:"We need to deal with this before it gets worse.",                tag:"phrasal-b2" },
  { id:169, en:"He deals with complaints every day and never complains.",        tag:"phrasal-b2" },
  { id:170, en:"How do you deal with the pressure of your job?",                 tag:"phrasal-b2" },

  // build up / back down
  { id:171, en:"She has been building up her confidence for months.",            tag:"phrasal-b2" },
  { id:172, en:"He built up a successful business from nothing.",                tag:"phrasal-b2" },
  { id:173, en:"He refused to back down even when everyone disagreed.",          tag:"phrasal-b2" },
  { id:174, en:"She backed down once she realised she was wrong.",               tag:"phrasal-b2" },
  { id:175, en:"Tension had been building up for weeks before it exploded.",     tag:"phrasal-b2" },

  // cope with / get through
  { id:176, en:"She is finding it hard to cope with everything.",                tag:"phrasal-b2" },
  { id:177, en:"How do you cope with working such long hours?",                  tag:"phrasal-b2" },
  { id:178, en:"It was really tough but we got through it together.",            tag:"phrasal-b2" },
  { id:179, en:"I do not know how she gets through the day.",                    tag:"phrasal-b2" },
  { id:180, en:"He coped with the loss better than anyone expected.",            tag:"phrasal-b2" },

  // hold up / turn down
  { id:181, en:"I was held up in traffic and missed the first half.",            tag:"phrasal-b2" },
  { id:182, en:"What is holding you up? We have been waiting.",                  tag:"phrasal-b2" },
  { id:183, en:"She turned down the job because the salary was too low.",        tag:"phrasal-b2" },
  { id:184, en:"He turned down every invitation until she called.",              tag:"phrasal-b2" },
  { id:185, en:"Can you turn the music down? I am on the phone.",                tag:"phrasal-b2" },

  // keep on / save up
  { id:186, en:"He kept on talking even when nobody was listening.",             tag:"phrasal-b2" },
  { id:187, en:"Keep on trying. You will get there eventually.",                 tag:"phrasal-b2" },
  { id:188, en:"I am saving up for a trip to Japan next summer.",                tag:"phrasal-b2" },
  { id:189, en:"She saved up for three years to buy her first car.",             tag:"phrasal-b2" },
  { id:190, en:"He kept on making the same mistake every single time.",          tag:"phrasal-b2" },

  // look up to / let go of
  { id:191, en:"I have always looked up to my older sister.",                    tag:"phrasal-b2" },
  { id:192, en:"The whole team looks up to her because she is so fair.",         tag:"phrasal-b2" },
  { id:193, en:"You need to let go of the past and move forward.",               tag:"phrasal-b2" },
  { id:194, en:"She found it impossible to let go of the past.",                 tag:"phrasal-b2" },
  { id:195, en:"He looks up to his father more than anyone else.",               tag:"phrasal-b2" },

  // take up / speed up
  { id:196, en:"She took up running to clear her head after a tough year.",      tag:"phrasal-b2" },
  { id:197, en:"He took up the guitar at forty and became really good.",         tag:"phrasal-b2" },
  { id:198, en:"Can you speed up? We are going to miss the train.",              tag:"phrasal-b2" },
  { id:199, en:"Things will speed up once we have more people.",                 tag:"phrasal-b2" },
  { id:200, en:"Taking up a new hobby is a great way to meet people.",           tag:"phrasal-b2" },

  // break out / break in
  { id:201, en:"A fight broke out in the street outside the restaurant.",        tag:"phrasal-b2" },
  { id:202, en:"Panic broke out when the alarm went off.",                       tag:"phrasal-b2" },
  { id:203, en:"Someone broke in while we were away and took the laptop.",       tag:"phrasal-b2" },
  { id:204, en:"She broke in and interrupted him mid-sentence.",                 tag:"phrasal-b2" },
  { id:205, en:"It took weeks to break in her new shoes.",                       tag:"phrasal-b2" },

  // log in / log out
  { id:206, en:"I cannot log in, it keeps saying my password is wrong.",         tag:"phrasal-b2" },
  { id:207, en:"Log out when you are done, especially on shared computers.",     tag:"phrasal-b2" },
  { id:208, en:"She forgot to log out and left her account open.",               tag:"phrasal-b2" },
  { id:209, en:"You need to log in every time you open the app.",                tag:"phrasal-b2" },
  { id:210, en:"He logged out and handed the laptop back.",                      tag:"phrasal-b2" },

  // look into / figure out (B2 context)
  { id:211, en:"The company is looking into reducing its carbon footprint.",     tag:"phrasal-b2" },
  { id:212, en:"We are looking into expanding abroad.",                          tag:"phrasal-b2" },
  { id:213, en:"Scientists are trying to figure out what caused it.",            tag:"phrasal-b2" },
  { id:214, en:"I finally figured out what had been bothering me.",              tag:"phrasal-b2" },
  { id:215, en:"The police are looking into the matter very carefully.",         tag:"phrasal-b2" },

  // make up (B2 nuances)
  { id:216, en:"She made up a believable excuse and nobody noticed.",            tag:"phrasal-b2" },
  { id:217, en:"Women make up more than half of the workforce now.",             tag:"phrasal-b2" },
  { id:218, en:"They eventually made up after months of not speaking.",          tag:"phrasal-b2" },
  { id:219, en:"He made up the whole story just to get attention.",              tag:"phrasal-b2" },
  { id:220, en:"Rent and food make up most of my monthly expenses.",             tag:"phrasal-b2" },

  // end up (B2 context)
  { id:221, en:"If you are not careful you will end up regretting it.",          tag:"phrasal-b2" },
  { id:222, en:"She ended up in a completely different career.",                 tag:"phrasal-b2" },
  { id:223, en:"We ended up talking until three in the morning.",                tag:"phrasal-b2" },
  { id:224, en:"He ended up moving back home after losing his job.",             tag:"phrasal-b2" },
  { id:225, en:"Things always end up working out one way or another.",           tag:"phrasal-b2" },

  // set up (B2 context)
  { id:226, en:"They set up a fund to support young artists.",                   tag:"phrasal-b2" },
  { id:227, en:"The government set up a committee to investigate.",              tag:"phrasal-b2" },
  { id:228, en:"She set up an automatic payment so she never forgets.",          tag:"phrasal-b2" },
  { id:229, en:"He felt like someone had set him up.",                           tag:"phrasal-b2" },
  { id:230, en:"They set up a meeting to try to reach a deal.",                  tag:"phrasal-b2" },

  // carry out / deal with (mixed B2)
  { id:231, en:"The operation was carried out by a specialist team.",            tag:"phrasal-b2" },
  { id:232, en:"Research was carried out over three years.",                     tag:"phrasal-b2" },
  { id:233, en:"The company is struggling to deal with the demand.",             tag:"phrasal-b2" },
  { id:234, en:"She dealt with the crisis calmly and professionally.",           tag:"phrasal-b2" },
  { id:235, en:"They had to carry out emergency repairs on the bridge.",         tag:"phrasal-b2" },

  // EXTRA — frasi miste stile Friends/HIMYM ─────────────────────────────────

  { id:236, en:"I ended up calling him even though I said I would not.",         tag:"phrasal-b1" },
  { id:237, en:"She figured out he was lying from the look on his face.",        tag:"phrasal-b1" },
  { id:238, en:"We ran out of things to talk about after ten minutes.",          tag:"phrasal-b1" },
  { id:239, en:"He turned up at the wedding even though nobody invited him.",    tag:"phrasal-b1" },
  { id:240, en:"I woke up and realised I had overslept by two hours.",           tag:"phrasal-a2" },
  { id:241, en:"She gave up trying to explain and just walked away.",            tag:"phrasal-a2" },
  { id:242, en:"They broke up, got back together, and broke up again.",          tag:"phrasal-b1" },
  { id:243, en:"I cannot figure out if she likes me or not.",                    tag:"phrasal-b1" },
  { id:244, en:"He showed up with flowers and I forgot I was angry.",            tag:"phrasal-b1" },
  { id:245, en:"She turned down three job offers before finding the right one.", tag:"phrasal-b2" },
  { id:246, en:"We ended up watching three episodes instead of one.",            tag:"phrasal-b1" },
  { id:247, en:"He let me down so many times that I stopped counting.",          tag:"phrasal-b1" },
  { id:248, en:"Just calm down and tell me what happened.",                      tag:"phrasal-a2" },
  { id:249, en:"She picked up the bill without even asking.",                    tag:"phrasal-a2" },
  { id:250, en:"I need to sort out this situation before it gets out of hand.",  tag:"phrasal-b1" },
  { id:251, en:"He kept on texting her even after she asked him to stop.",       tag:"phrasal-b2" },
  { id:252, en:"We stayed in and chilled out, too tired to go out.",             tag:"phrasal-b1" },
  { id:253, en:"She came back from her trip a different person.",                tag:"phrasal-a2" },
  { id:254, en:"I signed up for the gym in January and went exactly twice.",     tag:"phrasal-b1" },
  { id:255, en:"He built up the courage to ask her out after three months.",     tag:"phrasal-b2" },
  { id:256, en:"They called off the wedding two weeks before the date.",         tag:"phrasal-b1" },
  { id:257, en:"She put off telling him the truth for as long as possible.",     tag:"phrasal-a2" },
  { id:258, en:"I look up to people who stay positive no matter what.",          tag:"phrasal-b2" },
  { id:259, en:"He made up an excuse and left before things got awkward.",       tag:"phrasal-b2" },
  { id:260, en:"We need to catch up. It has been way too long.",                 tag:"phrasal-b1" },
  { id:261, en:"She picked up the habit of running every morning.",              tag:"phrasal-a2" },
  { id:262, en:"I cannot cope with this much stress for much longer.",           tag:"phrasal-b2" },
  { id:263, en:"He got through the interview even though he was terrified.",     tag:"phrasal-b2" },
  { id:264, en:"She let go of everything that was holding her back.",            tag:"phrasal-b2" },
  { id:265, en:"We set up a group chat and everyone started talking again.",     tag:"phrasal-b1" },
  { id:266, en:"He turned the music down when the neighbours knocked.",          tag:"phrasal-b2" },
  { id:267, en:"She dropped by without warning and stayed for four hours.",      tag:"phrasal-b1" },
  { id:268, en:"I cannot figure out why I even said yes.",                       tag:"phrasal-b1" },
  { id:269, en:"He gave up meat and lost five kilos without trying.",            tag:"phrasal-a2" },
  { id:270, en:"She ended up loving the city she always said she hated.",        tag:"phrasal-b1" },
  { id:271, en:"I am going to take up painting. I need something creative.",     tag:"phrasal-b2" },
  { id:272, en:"They worked out their differences and became close friends.",    tag:"phrasal-b1" },
  { id:273, en:"She kept on smiling even when things were really hard.",         tag:"phrasal-b2" },
  { id:274, en:"He showed up looking like he had not slept in days.",            tag:"phrasal-b1" },
  { id:275, en:"I am saving up to move out and get my own place.",               tag:"phrasal-b2" },
  { id:276, en:"She broke down and admitted she had no idea what to do.",        tag:"phrasal-b1" },
  { id:277, en:"We have to deal with this now, not tomorrow.",                   tag:"phrasal-b2" },
  { id:278, en:"He went for the promotion even though he was not ready.",        tag:"phrasal-b1" },
  { id:279, en:"She took over and suddenly everything ran smoothly.",            tag:"phrasal-b2" },
  { id:280, en:"I woke up feeling that today was going to be different.",        tag:"phrasal-a2" },
  { id:281, en:"He turned up to every practice without being asked.",            tag:"phrasal-b1" },
  { id:282, en:"She looked into it and found it was cheaper than expected.",     tag:"phrasal-b2" },
  { id:283, en:"I do not want to end up regretting my choices.",                 tag:"phrasal-b2" },
  { id:284, en:"He came up with an idea that changed everything.",               tag:"phrasal-b2" },
  { id:285, en:"She backed down once she realised she was wrong.",               tag:"phrasal-b2" },
  { id:286, en:"I grew up thinking I would never leave my hometown.",            tag:"phrasal-a2" },
  { id:287, en:"She sorted out the problem in about five minutes flat.",         tag:"phrasal-b1" },
  { id:288, en:"He cheered up as soon as he saw his friends.",                   tag:"phrasal-a2" },
  { id:289, en:"They carried out the plan without anyone finding out.",          tag:"phrasal-b2" },
  { id:290, en:"I look forward to the day when this is all over.",               tag:"phrasal-b1" },
  { id:291, en:"She figured out the answer just before time ran out.",           tag:"phrasal-b1" },
  { id:292, en:"He put off going to the doctor for months.",                     tag:"phrasal-a2" },
  { id:293, en:"We ended up at the same restaurant three weekends in a row.",    tag:"phrasal-b1" },
  { id:294, en:"She held up the queue looking for her card.",                    tag:"phrasal-b2" },
  { id:295, en:"He kept on asking until she finally said yes.",                  tag:"phrasal-b2" },
  { id:296, en:"I cannot put up with bad service. I always speak up.",           tag:"phrasal-b1" },
  { id:297, en:"She brought it up at the worst possible moment.",                tag:"phrasal-b1" },
  { id:298, en:"He ran out of excuses and had to tell the truth.",               tag:"phrasal-a2" },
  { id:299, en:"She came down with something the night before.",                 tag:"phrasal-b1" },
  { id:300, en:"I am going to give this everything I have got.",                 tag:"phrasal-a2" },

];

export default SHADOW;
