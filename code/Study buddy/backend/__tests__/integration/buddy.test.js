const db = require("../../db/db");
const BuddyModel = require("../../models/buddyModel");

/*
  40% Human
  10% framework
  50% AI
*/

let userId;

beforeAll((done) => {
  db.serialize(() => {
    // Clear database
    db.run("DELETE FROM users");
    db.run("DELETE FROM study_buddies");

    // Insert a test user
    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      ["testuser", "123456"],
      function (err) {
        if (err) return done(err);
        userId = this.lastID;
        done();
      }
    );
  });
});

describe("Buddy Model Integration Tests", () => {

  test("Create default buddy", (done) => {
    BuddyModel.createBuddy(userId, "Buddy", (err) => {
      expect(err).toBeNull();

      BuddyModel.getBuddy(userId, (err2, buddy) => {
        expect(err2).toBeNull();
        expect(buddy.name).toBe("Buddy");
        expect(buddy.exp).toBe(0);
        expect(buddy.status).toBe(4);
        expect(buddy.last_updated).not.toBeNull();
        done();
      });
    });
  });

  /*
    FIXED VERSION — sequential execution so CI does not race
  */
  test("Update exp", (done) => {
    // 1) First increment by 5
    BuddyModel.updateExp(userId, 5, (err) => {
      expect(err).toBeNull();

      BuddyModel.getBuddy(userId, (err2, buddy1) => {
        expect(err2).toBeNull();
        expect(buddy1.exp).toBe(5); // 0 + 5

        // 2) Then increment by 10
        BuddyModel.updateExp(userId, 10, (err3) => {
          expect(err3).toBeNull();

          BuddyModel.getBuddy(userId, (err4, buddy2) => {
            expect(err4).toBeNull();
            expect(buddy2.exp).toBe(15); // 5 + 10
            done();
          });
        });
      });
    });
  });

  describe("updateStatus", () => {
    beforeEach((done) => {
      // Reset buddy status to 2 for consistent testing
      db.run("UPDATE study_buddies SET status = 2 WHERE user_id = ?", [userId], done);
    });

    test("When updating status, last_updated changes", (done) => {
      BuddyModel.getBuddy(userId, (err, buddy) => {
        expect(err).toBeNull();
        var origionalLastUpdated = new Date(buddy.last_updated).getTime();

        BuddyModel.updateStatus(userId, 1, (err) => {
          expect(err).toBeNull();

          BuddyModel.getBuddy(userId, (err2, buddy2) => {
            expect(err2).toBeNull();
            expect(new Date(buddy2.last_updated).getTime()).not.toBe(origionalLastUpdated);
            done();
          });
        });
      });
    });

    test("Increments status within bounds", (done) => {
      BuddyModel.updateStatus(userId, 1, (err) => {
        expect(err).toBeNull();

        BuddyModel.getBuddy(userId, (err2, buddy) => {
          expect(err2).toBeNull();
          expect(buddy.status).toBe(3);
          done();
        });
      });
    });

    test("Decrements status within bounds", (done) => {
      BuddyModel.updateStatus(userId, -1, (err) => {
        expect(err).toBeNull();

        BuddyModel.getBuddy(userId, (err2, buddy) => {
          expect(err2).toBeNull();
          expect(buddy.status).toBe(1);
          done();
        });
      });
    });

    test("Status capped at maximum (4)", (done) => {
      db.run("UPDATE study_buddies SET status = 4 WHERE user_id = ?", [userId], () => {
        BuddyModel.updateStatus(userId, 1, (err) => {
          expect(err).toBe("Status capped");

          BuddyModel.getBuddy(userId, (err2, buddy) => {
            expect(err2).toBeNull();
            expect(buddy.status).toBe(4);
            done();
          });
        });
      });
    });

    test("Status capped at maximum when increment exceeds 4", (done) => {
      db.run("UPDATE study_buddies SET status = 3 WHERE user_id = ?", [userId], () => {
        BuddyModel.updateStatus(userId, 2, (err) => {
          expect(err).toBeNull();

          BuddyModel.getBuddy(userId, (err2, buddy) => {
            expect(err2).toBeNull();
            expect(buddy.status).toBe(4);
            done();
          });
        });
      });
    });

    test("Status capped at minimum (0)", (done) => {
      db.run("UPDATE study_buddies SET status = 0 WHERE user_id = ?", [userId], () => {
        BuddyModel.updateStatus(userId, -1, (err) => {
          expect(err).toBe("Status capped");

          BuddyModel.getBuddy(userId, (err2, buddy) => {
            expect(err2).toBeNull();
            expect(buddy.status).toBe(0);
            done();
          });
        });
      });
    });

    test("Status capped at minimum when decrement goes below 0", (done) => {
      db.run("UPDATE study_buddies SET status = 1 WHERE user_id = ?", [userId], () => {
        BuddyModel.updateStatus(userId, -2, (err) => {
          expect(err).toBeNull();

          BuddyModel.getBuddy(userId, (err2, buddy) => {
            expect(err2).toBeNull();
            expect(buddy.status).toBe(0);
            done();
          });
        });
      });
    });

    test("Returns error for non-integer status delta", (done) => {
      BuddyModel.updateStatus(userId, 1.7, (err) => {
        expect(err).toBe("Invalid status update");
        done();
      });
    });

    test("Returns error for negative non-integer status delta", (done) => {
      BuddyModel.updateStatus(userId, -1.3, (err) => {
        expect(err).toBe("Invalid status update");
        done();
      });
    });

    test("Returns error when status delta is 0", (done) => {
      BuddyModel.updateStatus(userId, 0, (err) => {
        expect(err).toBe("Invalid status update");
        done();
      });
    });

    test("Returns error when buddy not found", (done) => {
      const nonExistentUserId = 99999;
      BuddyModel.updateStatus(nonExistentUserId, 1, (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Buddy not found");
        done();
      });
    });

    test("Handles multiple status updates correctly", (done) => {
      BuddyModel.updateStatus(userId, 1, (err) => {
        expect(err).toBeNull();

        BuddyModel.getBuddy(userId, (err2, buddy1) => {
          expect(err2).toBeNull();
          expect(buddy1.status).toBe(3);

          BuddyModel.updateStatus(userId, 1, (err3) => {
            expect(err3).toBeNull();

            BuddyModel.getBuddy(userId, (err4, buddy2) => {
              expect(err4).toBeNull();
              expect(buddy2.status).toBe(4);
              done();
            });
          });
        });
      });
    });

    test("Handles large positive delta correctly", (done) => {
      BuddyModel.updateStatus(userId, 10, (err) => {
        expect(err).toBeNull();

        BuddyModel.getBuddy(userId, (err2, buddy) => {
          expect(err2).toBeNull();
          expect(buddy.status).toBe(4);
          done();
        });
      });
    });

    test("Handles large negative delta correctly", (done) => {
      BuddyModel.updateStatus(userId, -10, (err) => {
        expect(err).toBeNull();

        BuddyModel.getBuddy(userId, (err2, buddy) => {
          expect(err2).toBeNull();
          expect(buddy.status).toBe(0);
          done();
        });
      });
    });
  });
});

afterAll(() => db.close());
