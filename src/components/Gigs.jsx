import Window from './Window.jsx';
import Icon from './Icon.jsx';
import { gigs } from '../data/gigs.js';

const goContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

/** Live shows & tour dates window. */
export default function Gigs() {
  return (
    <Window
      id="gigs"
      title="Gigs - Tour Dates"
      icon="calendar"
      className="gigs-win"
      statusBar={[`${gigs.length} upcoming show(s)`, 'Bookings: vark19team@gmail.com']}
    >
      <div className="sunken-panel gigs-panel">
        {gigs.length === 0 ? (
          <div className="gigs-empty">
            <Icon name="calendar" scale={3} />
            <p>No upcoming gigs announced yet.</p>
            <p className="muted">Check back soon or reach out for bookings.</p>
            <button className="default" onClick={goContact}>
              Book VARK →
            </button>
          </div>
        ) : (
          <table className="gigs-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>City</th>
                <th>Venue / Event</th>
                <th>Tickets</th>
              </tr>
            </thead>
            <tbody>
              {gigs.map((g) => (
                <tr key={g.id}>
                  <td>{g.date}</td>
                  <td>{g.city}</td>
                  <td>{g.title ? `${g.title} — ${g.venue}` : g.venue}</td>
                  <td>
                    {g.soldOut ? (
                      <span className="gigs-sold">Sold Out</span>
                    ) : g.ticketUrl ? (
                      <a href={g.ticketUrl} target="_blank" rel="noreferrer">
                        Tickets ↗
                      </a>
                    ) : (
                      'TBA'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Window>
  );
}
