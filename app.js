// App State
let habits = JSON.parse(localStorage.getItem('habits')) || [];

// DOM Elements
const habitList = document.getElementById('habit-list');
const addHabitForm = document.getElementById('add-habit-form');
const habitInput = document.getElementById('habit-input');
const emptyState = document.getElementById('empty-state');
const dateDisplay = document.getElementById('date-display');

// Initialize
function init() {
    renderDate();
    renderHabits();
    lucide.createIcons();
}

// Helpers
function getTodayString() {
    const d = new Date();
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

function renderDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
}

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
    renderHabits();
}

// Render Logic
function renderHabits() {
    habitList.innerHTML = '';
    
    if (habits.length === 0) {
        habitList.appendChild(emptyState);
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    const today = getTodayString();

    habits.forEach(habit => {
        const isCompletedToday = habit.completedDates.includes(today);
        
        const li = document.createElement('div');
        li.className = `habit-item ${isCompletedToday ? 'completed' : ''}`;
        li.dataset.id = habit.id;
        
        li.innerHTML = `
            <div class="habit-content">
                <div class="checkbox-visual">
                    ${isCompletedToday ? '<i data-lucide="check" style="color: white; width: 16px; height: 16px;"></i>' : ''}
                </div>
                <span class="habit-name">${escapeHtml(habit.name)}</span>
            </div>
            <button class="delete-btn" aria-label="Delete habit">
                <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
            </button>
        `;

        // Click event for toggling completion
        li.querySelector('.habit-content').addEventListener('click', () => toggleHabit(habit.id));
        
        // Click event for delete
        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteHabit(habit.id);
        });

        habitList.appendChild(li);
    });

    lucide.createIcons();
}

// Actions
function addHabit(name) {
    const newHabit = {
        id: Date.now().toString(),
        name: name,
        completedDates: []
    };
    habits.push(newHabit);
    saveHabits();
}

function toggleHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const today = getTodayString();
    const index = habit.completedDates.indexOf(today);

    if (index === -1) {
        habit.completedDates.push(today);
        // Add pop animation effect logic here if needed, or rely on CSS re-render
    } else {
        habit.completedDates.splice(index, 1);
    }
    
    saveHabits();
}

function deleteHabit(id) {
    if(confirm('Delete this habit?')) {
        habits = habits.filter(h => h.id !== id);
        saveHabits();
    }
}

// Event Listeners
addHabitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = habitInput.value.trim();
    if (name) {
        addHabit(name);
        habitInput.value = '';
        habitInput.blur(); // Dismiss keyboard on mobile
    }
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Start
init();
