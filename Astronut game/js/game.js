// Check if a user is logged in
const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
    const warningMessage = document.getElementById("warningMessage");
    warningMessage.style.display = "block";

    setTimeout(() => {
        window.location.href = './login.html';
    }, 2000);
} else {
    let astronautImage = new Image();
    let rockImage = new Image();
    let backgroundImage = new Image();
    let heartCoinImage = new Image(); 

    astronautImage.src = '../images/Astronaut.png';
    rockImage.src = '../images/rock_type_planet.png';
    backgroundImage.src = '../images/layer-1.png';
    heartCoinImage.src = '../images/heart_coin.jpg'; 

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let groundHeight = canvas.height - 100;

    // Game Variables
    let astronaut, rocks, heartCoins, score, gameSpeed, backgroundX, backgroundSpeed, timeElapsed;
    let gameOver = false;
    let level = 1;
    let doubleJumpAvailable = true;
    let isCrawling = false;
    let isFlying = false; 
    let flightDuration = 0; 
    let heartCoinsCollected = 0; 
    let users = {};

    // Initialize Game Variables
    function initializeGame() {
        astronaut = { x: 50, y: groundHeight, width: 50, height: 50, speedY: 0, gravity: 0.2, isJumping: false };
        rocks = [];
        heartCoins = [];
        score = 0;
        gameSpeed = 2;
        level = 1;
        backgroundX = 0;
        backgroundSpeed = 1;
        timeElapsed = 0;
        gameOver = false;
        doubleJumpAvailable = true;
        isCrawling = false;
        heartCoinsCollected = 0; // Reset collected heart coins
        isFlying = false; // Reset flying status
        flightDuration = 0; // Reset flight timer
    }

    // Handle Keyboard Input for Jumping, Double Jump, Crawling, and Flying
    document.addEventListener("keydown", function(event) {
        if (event.code === "Space" && !gameOver) {
            jump();
        } else if (event.code === "KeyD" && !gameOver && doubleJumpAvailable) {
            doubleJump();
        } else if (event.code === "KeyC" && !gameOver) {
            crawl();
        } else if (event.code === "KeyR" && gameOver) {
            restartGame();
        }
    });

    document.addEventListener("keyup", function(event) {
        if (event.code === "KeyC") {
            stopCrawl();
        }
    });

    document.getElementById("restartButton").addEventListener("click", function () {
        restartGame();
    });

    document.getElementById("homeButton").addEventListener("click", function () {
        window.location.href = '../index.html';
    });

    // Jump Function
    function jump() {
        if (!astronaut.isJumping) {
            astronaut.speedY = -10;
            astronaut.isJumping = true;
        }
    }

    // Double Jump Function
    function doubleJump() {
        astronaut.speedY = -12;
        doubleJumpAvailable = false;
    }

    // Crawl Function
    function crawl() {
        astronaut.height = 30; 
        isCrawling = true;
    }

    // Stop Crawl Function
    function stopCrawl() {
        astronaut.height = 50; 
        isCrawling = false;
    }

    // Generate Rocks with Logical Placement
    function createRock() {
        const rockTypeOptions = ["jump", "doubleJump", "crawl"];
        
        const selectedType = rockTypeOptions[Math.floor(Math.random() * rockTypeOptions.length)];
        let rockHeight, rockY;

        // Set rock positions based on type
        switch (selectedType) {
            case "jump":
                rockHeight = 60; // Higher position for jumping
                rockY = groundHeight - rockHeight + 10 ;
                break;
            case "doubleJump":
                rockHeight = 100; // Even higher for double jumping
                rockY = groundHeight - rockHeight + 10;
                break;
            case "crawl":
                rockHeight = 30; // Low position for crawling
                rockY = groundHeight - rockHeight + 3; // Slightly above ground for crawling
                break;
        }

        // Ensure rocks have appropriate spacing
        const lastRock = rocks[rocks.length - 1];
        if (!lastRock || lastRock.x < canvas.width - 300) {
            rocks.push({
                x: canvas.width,
                y: rockY,
                width: 30,
                height: rockHeight,
                type: selectedType
            });
        }
    }

    // Generate Heart Coins with random placement, avoiding overlap with rocks
    function createHeartCoin() {
        const coinHeight = 30;
        let coinY;

        // Ensure there are rocks to base the heart coin's position on
        if (rocks.length > 0) {
            const lastRock = rocks[rocks.length - 1]; // Get the last rock
            const randomOffset = Math.random() * 100 + 20; // Random height offset (20 to 120 pixels)

            // Place the heart coin above the last rock
            coinY = lastRock.y - coinHeight - randomOffset; // Above the rock

            // Check if the generated position is valid
            if (coinY < 0) {
                coinY = Math.random() * (groundHeight - 150) + 50; // If it's below zero, reset to a random position
            }
        } else {
            // Fallback for no rocks
            coinY = Math.random() * (groundHeight - 150) + 50; // Random height for heart coin
        }

        // Create the heart coin object
        const newHeartCoin = {
            x: canvas.width,
            y: coinY,
            width: 30,
            height: coinHeight
        };

        // Ensure the heart coin does not overlap with rocks
        let overlaps = false;
        for (const rock of rocks) {
            if (checkCollision(newHeartCoin, rock)) {
                overlaps = true; 
                break;
            }
        }

        // If it overlaps, try creating again
        if (!overlaps) {
            heartCoins.push(newHeartCoin); 
        } else {
            createHeartCoin(); 
        }
    }

    // Check Collision
    function checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y;
    }

    // Level up game based on score
    function updateLevelAndSpeed() {
        if (score >= 250) {
            level = 6; gameSpeed = 7;
        } else if (score >= 200) {
            level = 5; gameSpeed = 6;
        } else if (score >= 150) {
            level = 4; gameSpeed = 5;
        } else if (score >= 100) {
            level = 3; gameSpeed = 4;
        } else if (score >= 50) {
            level = 2; gameSpeed = 3;
        } else {
            level = 1; gameSpeed = 2; 
        }
    }

    // Update Game
    function updateGame() {
        if (gameOver) return;

        timeElapsed += 1 / 60;

        // Handle background movement
        backgroundX -= backgroundSpeed;
        if (backgroundX <= -canvas.width) {
            backgroundX = 0;
        }

        // Handle astronaut physics
        astronaut.y += astronaut.speedY;
        astronaut.speedY += astronaut.gravity;

        // Reset astronaut position if on ground
        if (astronaut.y >= groundHeight) {
            astronaut.y = groundHeight;
            astronaut.speedY = 0;
            astronaut.isJumping = false;
            doubleJumpAvailable = true;
        }

        // Update rocks and check for collisions
        for (let i = rocks.length - 1; i >= 0; i--) {
            let rock = rocks[i];
            rock.x -= gameSpeed;

            if (checkCollision(astronaut, rock)) {
                if (rock.type === "jump" && !astronaut.isJumping) {
                    handleGameOver();
                    return;
                } else if (rock.type === "doubleJump" && (!astronaut.isJumping || doubleJumpAvailable)) {
                    handleGameOver();
                    return;
                } else if (rock.type === "crawl" && !isCrawling) {
                    handleGameOver();
                    return;
                }
            }

            if (rock.x + rock.width < 0) {
                rocks.splice(i, 1);
            }
        }

        // Update heart coins and check for collection
        for (let i = heartCoins.length - 1; i >= 0; i--) {
            let coin = heartCoins[i];
            coin.x -= gameSpeed;

            if (checkCollision(astronaut, coin)) {
                heartCoinsCollected++;
                score += 5; // Increment score for collecting heart coins

                // Activate flight mode after collecting 80 heart coins
                if (heartCoinsCollected === 80) {
                    isFlying = true; // Activate flight mode
                    flightDuration = 3; // Set flight duration to 3 seconds
                }

                heartCoins.splice(i, 1); 
            }

            if (coin.x + coin.width < 0) {
                heartCoins.splice(i, 1);
            }
        }

        // Create new rocks
        if (rocks.length === 0 || rocks[rocks.length - 1].x < canvas.width - 300) {
            createRock();
        }

        // Create heart coins more frequently
        if (heartCoins.length < 10 && (Math.random() < 0.05)) { 
            createHeartCoin();
        }

        updateLevelAndSpeed();
    }

    // Draw Game
    function drawGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);

        ctx.drawImage(astronautImage, astronaut.x, astronaut.y, astronaut.width, astronaut.height);

        rocks.forEach(rock => {
            ctx.drawImage(rockImage, rock.x, rock.y, rock.width, rock.height);
        });

        heartCoins.forEach(coin => {
            ctx.drawImage(heartCoinImage, coin.x, coin.y, coin.width, coin.height);
        });

        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "left"; 
        ctx.fillText(`Score: ${score} | Level: ${level} | Time: ${Math.floor(timeElapsed)}s`, 10, 30);

        ctx.textAlign = "left"; 
        ctx.fillText(`Stars: ${heartCoinsCollected}`, 10, 60); 
    }

    // Game Loop
    function gameLoop() {
        updateGame();
        drawGame();

        if (!gameOver) {
            requestAnimationFrame(gameLoop);
        }
    }

    // Save Score
    function saveScore() {
        const currentUser = localStorage.getItem("currentUser"); // Current logged-in user
        if (!currentUser) return; // Ensure there is a logged-in user

        // Retrieve existing user data from localStorage
        const userData = JSON.parse(localStorage.getItem(currentUser)) || {
            topScore: 0,
            bestTime: Infinity,
            latestScore: 0,
            latestTime: Infinity
        };

        // Update best score and best time
        if (score > userData.topScore) {
            userData.topScore = score; // Update top score if the new score is higher
        }
        if (timeElapsed < userData.bestTime) {
            userData.bestTime = timeElapsed; // Update best time if the new time is lower
        }

        // Update latest score and latest time regardless of best
        userData.latestScore = score; // Always set latest score to current score
        userData.latestTime = timeElapsed; // Always set latest time to current elapsed time

        // Save updated user data back to localStorage
        localStorage.setItem(currentUser, JSON.stringify(userData));
    }


    // Call this function in handleGameOver
    function handleGameOver() {
        gameOver = true;
        document.getElementById("finalScore").textContent = `Score: ${score}, Time: ${Math.floor(timeElapsed)}s`;
        document.getElementById("scoreboard").style.display = "block";

        // Update user score with the latest score and time
        saveScore(); // Use saveScore instead of updateUserScore

        // Optionally, update leaderboard if needed
        updateLeaderboard();
    }

    // Load Users
    function loadUsers() {
        const usersString = localStorage.getItem("users");
        if (usersString) {
            users = JSON.parse(usersString);
        }
    }

    // Save Users
    function saveUsers() {
        localStorage.setItem("users", JSON.stringify(users));
    }

    function updateLeaderboard() {
        const leaderboardList = document.getElementById("leaderboardList");
        leaderboardList.innerHTML = ""; // Clear the current leaderboard
    
        // Initialize an array to hold user data
        const usersData = [];
    
        // Loop through local storage to find users and their top scores
        Object.keys(localStorage).forEach(key => {
            if (key !== 'currentUser' && key !== 'loggedIn') { // Exclude special keys
                const userData = JSON.parse(localStorage.getItem(key));
                if (userData && userData.topScore !== undefined) {
                    usersData.push({
                        username: key, // The key is the username
                        topScore: userData.topScore
                    });
                }
            }
        });
    
        // Sort users by topScore in descending order
        const sortedUsers = usersData.sort((a, b) => b.topScore - a.topScore).slice(0, 5); // Get only the top 5 users
    
        // Render each of the top 5 users in the leaderboard list
        if (sortedUsers.length === 0) {
            leaderboardList.textContent = "No users found in localStorage.";
        } else {
            sortedUsers.forEach((userData, index) => {
                const listItem = document.createElement("li");
                listItem.textContent = `${userData.username} : ${userData.topScore}`;
                leaderboardList.appendChild(listItem);
            });
        }
    }    

    // Restart Game
    function restartGame() {
        document.getElementById("scoreboard").style.display = "none";
        initializeGame();
        gameLoop();
    }

    // Start the Game
    initializeGame();
    gameLoop();
}