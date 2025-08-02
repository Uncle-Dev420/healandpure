// Certificate Portal Front-End Logic
const refInput = document.getElementById('reference');
const lookupBtn = document.getElementById('lookup-btn');
const form = document.getElementById('lookup-form');
const loader = document.getElementById('loader');
const result = document.getElementById('result');
const modal = document.getElementById('modal');
const modalDesc = document.getElementById('modal-desc');
const closeModalBtn = document.getElementById('close-modal');

// Validation regex: 6-12 alphanumeric
const refPattern = /^[A-Za-z0-9]{6,12}$/;

function validateRef(value) {
  return refPattern.test(value);
}

function setInputState(valid) {
  refInput.classList.remove('valid', 'invalid');
  if (refInput.value.length === 0) {
    lookupBtn.disabled = true;
    return;
  }
  if (valid) {
    refInput.classList.add('valid');
    lookupBtn.disabled = false;
  } else {
    refInput.classList.add('invalid');
    lookupBtn.disabled = true;
  }
}

refInput.addEventListener('input', () => {
  setInputState(validateRef(refInput.value));
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const ref = refInput.value.trim();
  if (!validateRef(ref)) {
    showModal('Please enter a valid reference number (6–12 letters or numbers).');
    return;
  }
  result.innerHTML = '';
  loader.hidden = false;
  lookupBtn.disabled = true;
  refInput.disabled = true;
  try {
    const res = await fetch(`/api/certificate?ref=${encodeURIComponent(ref)}`);
    loader.hidden = true;
    refInput.disabled = false;
    setInputState(validateRef(refInput.value));
    if (res.ok) {
      // Expecting PDF file
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      result.innerHTML = `<a href="${url}" download="certificate-${ref}.pdf">Download PDF</a>`;
    } else {
      const data = await res.json().catch(() => ({}));
      showModal(data.error || 'Certificate not found.');
    }
  } catch (err) {
    loader.hidden = true;
    refInput.disabled = false;
    setInputState(validateRef(refInput.value));
    showModal('Network error. Please try again later.');
  }
});

function showModal(message) {
  modalDesc.textContent = message;
  modal.hidden = false;
  // Animate modal
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  // Trap focus
  closeModalBtn.focus();
}

function closeModal() {
  modal.classList.remove('show');
  setTimeout(() => {
    modal.hidden = true;
  }, 250);
}

closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (!modal.hidden && (e.key === 'Escape' || e.key === 'Enter')) {
    closeModal();
  }
});
