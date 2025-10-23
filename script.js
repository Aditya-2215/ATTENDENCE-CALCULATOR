    // Generate floating particles
    const bgAnimation = document.getElementById('bgAnimation');
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
      bgAnimation.appendChild(particle);
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      const navbar = document.getElementById('navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Calculate attendance
    function calculate() {
      const absent = parseInt(document.getElementById('absent').value) || 0;
      const oaa = parseInt(document.getElementById('oaa').value) || 0;
      const lecture = parseInt(document.getElementById('lecture').value) || 0;
      const resultDisplay = document.getElementById('resultDisplay');

      // Validation
      if (lecture === 0) {
        resultDisplay.innerHTML = `
          <div class="result-content">
            <div class="result-message" style="color: #d63031;">
              ⚠️ Please enter the total number of lectures conducted.
            </div>
          </div>
        `;
        resultDisplay.classList.add('show');
        return;
      }

      if (absent > lecture) {
        resultDisplay.innerHTML = `
          <div class="result-content">
            <div class="result-message" style="color: #d63031;">
              ❌ Absents cannot be more than total lectures!
            </div>
          </div>
        `;
        resultDisplay.classList.add('show');
        return;
      }

      // Calculate attendance
      const attended = lecture - absent + oaa;
      const totalClasses = lecture + oaa;
      const attendancePercent = (attended / totalClasses) * 100;

      // Determine status
      let statusClass = 'good';
      let statusMessage = '🎉 Excellent! You meet the requirement!';
      let statusIcon = '✅';
      
      if (attendancePercent < 90) {
        statusClass = 'danger';
        statusMessage = '⚠️ Critical: Below 90% - Fine applicable & CT/Pre-University detention risk!';
        statusIcon = '🚨';
      } else if (attendancePercent < 95) {
        statusClass = 'warning';
        statusMessage = '⚡ Safe, but close to the limit. Be careful!';
        statusIcon = '⚠️';
      }

      // Check for rewards
      let rewardInfo = '';
      let rewardAmount = 0;
      let rewardType = '';
      
      if (attendancePercent >= 99) {
        rewardAmount = 5000;
        rewardType = 'Platinum';
        statusClass = 'good';
        statusMessage = '🏆 Outstanding! Platinum Achievement - You\'re a star student!';
        statusIcon = '🌟';
        
        rewardInfo = `
          <div class="reward-display">
            <div class="reward-header">
              <div class="reward-display-icon">🏆</div>
              <div class="reward-display-title">Platinum Reward Earned!</div>
            </div>
            <div class="reward-message">
              Congratulations! Your exceptional attendance has earned you:
            </div>
            <div class="reward-amount-display">
              ₹${rewardAmount.toLocaleString('en-IN')}
            </div>
            <div style="text-align: center; margin-top: 1rem; font-size: 0.9rem; color: rgba(45, 52, 54, 0.7);">
              🎓 ${rewardType} Tier Achievement (99% - 100%)
            </div>
          </div>
        `;
      } else if (attendancePercent >= 97 && attendancePercent <= 98.99) {
        rewardAmount = 3000;
        rewardType = 'Gold';
        statusClass = 'good';
        statusMessage = '⭐ Excellent! Gold Achievement - Keep up the great work!';
        statusIcon = '🌟';
        
        rewardInfo = `
          <div class="reward-display">
            <div class="reward-header">
              <div class="reward-display-icon">⭐</div>
              <div class="reward-display-title">Gold Reward Earned!</div>
            </div>
            <div class="reward-message">
              Great job! Your outstanding attendance has earned you:
            </div>
            <div class="reward-amount-display">
              ₹${rewardAmount.toLocaleString('en-IN')}
            </div>
            <div style="text-align: center; margin-top: 1rem; font-size: 0.9rem; color: rgba(45, 52, 54, 0.7);">
              🎖️ ${rewardType} Tier Achievement (97% - 98.9%)
            </div>
            <div style="text-align: center; margin-top: 0.8rem; font-size: 0.85rem; color: #ff6b35; font-weight: 600;">
              💡 Just ${(99 - attendancePercent).toFixed(2)}% away from Platinum Reward (₹5,000)!
            </div>
          </div>
        `;
      }

      // Calculate fine and classes needed
      let additionalInfo = '';
      let fineInfo = '';
      
      if (attendancePercent < 90) {
        const percentageBelow = 90 - attendancePercent;
        const fineAmount = Math.ceil(percentageBelow);
        const totalFine = fineAmount * 400;
        const classesNeeded = Math.ceil((0.90 * totalClasses - attended) / 0.10);
        
        fineInfo = `
          <div class="fine-section">
            <div class="fine-header">
              <div class="fine-icon">💸</div>
              <div class="fine-title">Fine Breakdown</div>
            </div>
            <div class="fine-breakdown">
              <div class="fine-item">
                <span>Percentage Below 90%:</span>
                <span style="color: #d63031; font-weight: 800;">${percentageBelow.toFixed(2)}%</span>
              </div>
              <div class="fine-item">
                <span>Fine Rate:</span>
                <span style="color: #d63031; font-weight: 800;">₹400 per 1%</span>
              </div>
              <div class="fine-item">
                <span>Calculated Fine Units:</span>
                <span style="color: #d63031; font-weight: 800;">${fineAmount} units</span>
              </div>
            </div>
            <div class="fine-total">
              Total Fine: ₹${totalFine.toLocaleString('en-IN')}
            </div>
          </div>
        `;
        
        additionalInfo = `
          <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid rgba(255, 107, 53, 0.3);">
            <div style="color: #d63031; font-weight: 700; margin-bottom: 1rem; font-size: 1.1rem;">
              🔴 You are ${percentageBelow.toFixed(2)}% below the required 90%
            </div>
            <div style="margin-bottom: 0.8rem; font-size: 1.05rem;">
              📚 <strong>Classes Needed:</strong> <span style="color: #ff6b35; font-weight: 800;">${classesNeeded} consecutive classes</span> to reach 90%
            </div>
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(214, 48, 49, 0.1); border-radius: 12px; font-size: 0.95rem; color: #d63031; font-weight: 600;">
              ⚠️ Warning: Risk of detention from Pre-University exams and CT (Class Tests)
            </div>
          </div>
        `;
      } else {
        const classesCanMiss = Math.floor((attended - 0.90 * totalClasses) / 0.90);
        if (classesCanMiss > 0 && attendancePercent < 97) {
          additionalInfo = `<div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid rgba(255, 107, 53, 0.3);">
            <div style="color: #00b894; font-weight: 700; margin-bottom: 1rem; font-size: 1.05rem;">
              ✨ You can afford to miss <strong>${classesCanMiss}</strong> more ${classesCanMiss === 1 ? 'class' : 'classes'} and still maintain 90%
            </div>
          </div>`;
        }
      }

      resultDisplay.innerHTML = `
        <div class="result-content">
          <div class="attendance-percent ${statusClass}">
            ${statusIcon} ${attendancePercent.toFixed(2)}%
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${Math.min(attendancePercent, 100)}%"></div>
          </div>
          <div class="result-message" style="margin-top: 1rem;">
            ${statusMessage}
          </div>
          <div class="result-details">
            <strong>📊 Breakdown:</strong><br>
            Attended: <strong>${attended}</strong> | Total: <strong>${totalClasses}</strong> | Absents: <strong>${absent}</strong> | OAA: <strong>${oaa}</strong>
            ${fineInfo}
            ${rewardInfo}
            ${additionalInfo}
          </div>
        </div>
      `;
      resultDisplay.classList.add('show');
    }

    // Allow Enter key to calculate
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        calculate();
      }
    });

    // Add input animations
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('input', (e) => {
        if (e.target.value) {
          e.target.style.transform = 'scale(1.02)';
          setTimeout(() => {
            e.target.style.transform = 'scale(1)';
          }, 200);
        }
      });
    });