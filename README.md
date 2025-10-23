# 🎓 PSIT Attendance Calculator

A simple and **user-friendly Attendance Calculator** for PSIT students. This tool helps students calculate their **attendance percentage** and automatically computes **fines** if attendance falls below the required threshold.

---

## Features

- Calculate **attendance percentage** using **Total Lectures**, **Total Absent**, and **OAA (On Academic Activity)**.  
- Automatically compute **fine** for attendance below 90% (**₹400 per 1% deficit**).  
- Clean and interactive **web interface** with PSIT logo and text.  
- Fully **responsive design** for mobile and desktop screens.  

---

## 📊 Attendance Calculation Formula

The **attendance percentage** is calculated based on total lectures, absences, and any OAA credits as follows:

\[
\text{Attendance \%} = 100 - \left( \frac{\text{Total Absent} - \text{OAA}}{\text{Total Lectures}} \times 100 \right)
\]

### Explanation:

- **Total Lectures** – Total number of classes conducted.  
- **Total Absent** – Number of classes the student missed.  
- **OAA (Other Activity Attendance)** – Absences covered by academic activities (seminars, workshops, etc.) that **do not count** as true absence.  
- **Attendance %** – Final percentage of classes attended.

---

### 💰 Fine Calculation

If the **attendance percentage** falls below the minimum threshold of **90%**, a fine is applied as:

\[
\text{Fine (₹)} = (\text{90 - Attendance \%}) \times 400
\]

**Notes:**

- Each **1% below 90%** incurs a **₹400 fine**.  
- If attendance ≥ 90%, **no fine is applied**.  

### Example

| Total Lectures | Total Absent | OAA | Attendance % | Fine (₹) |
|----------------|--------------|-----|--------------|-----------|
| 340            | 10           | 0   | 97.06%       | 0         |
| 340            | 40           | 0   | 88.24%       | 7040      |

---

## Demo

![PSIT Attendance Calculator Logo](PSIT_logo_Red.svg)  

*Add a screenshot or GIF of your application here.*

---

## How to Use

1. Clone the repository:  
   ```bash
   git clone https://github.com/Aditya-2215/ATTENDANCE-CALCULATOR.git
   ```
2. Open in VS Code and run the ```index.html``` file.
