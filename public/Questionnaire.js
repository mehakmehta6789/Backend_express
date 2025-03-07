document.addEventListener("DOMContentLoaded", function () {
    const formSteps = document.querySelectorAll(".form-step");
    const nextBtns = document.querySelectorAll(".next-btn");
    const prevBtns = document.querySelectorAll(".prev-btn");
    const modal = document.getElementById("submitModal");
    const closeModalBtn = document.querySelector(".close-btn");
    let currentStep = 0;
  
    formSteps[currentStep].classList.add("active");
  
    nextBtns.forEach((button) => {
      button.addEventListener("click", () => {
        formSteps[currentStep].classList.remove("active");
        currentStep++;
        formSteps[currentStep].classList.add("active");
      });
    });
  
    prevBtns.forEach((button) => {
      button.addEventListener("click", () => {
        formSteps[currentStep].classList.remove("active");
        currentStep--;
        formSteps[currentStep].classList.add("active");
      });
    });
  
    const form = document.getElementById("multiStepForm");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // Show the modal
      modal.style.display = "block";
    });
  
    // Close modal when clicking the 'X'
    closeModalBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  
    // Close modal if clicking outside of modal content
    window.addEventListener("click", (e) => {
      if (e.target == modal) {
        modal.style.display = "none";
      }
    });
  });
  