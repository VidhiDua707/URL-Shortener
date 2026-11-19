
function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <section className="auth-left">
        <div className="auth-brand">
          <h1>SnapLink</h1>
          <p>Smart links. Powerful analytics.</p>
        </div>

        <div className="auth-visual">
          <div className="chart-labels">
            <span>↗ +24.5%</span>
            <span>● Click Insights</span>
          </div>

          <div className="chart-panels">
            <div className="chart-panel bar-chart">
              {[38, 58, 76, 91].map((height, index) => (
                <div
                  className="bar"
                  key={index}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            <div className="chart-panel line-chart">
              <svg viewBox="0 0 220 180">
                <path
                  d="M15 145 L65 105 L110 70 L165 35 L205 25"
                  fill="none"
                  stroke="#75b9ff"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {[ [15,145], [65,105], [110,70], [165,35], [205,25] ].map(
                  ([x, y], i) => (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="5"
                      fill="#ffffff"
                      stroke="#75b9ff"
                      strokeWidth="3"
                    />
                  )
                )}
              </svg>
            </div>
          </div>
        </div>

        <div className="auth-stats">
          <div><strong>Smart</strong><span>Short Links</span></div>
          <div><strong>24/7</strong><span>Tracking</span></div>
          <div><strong>Live</strong><span>Analytics</span></div>
        </div>
      </section>

      <section className="auth-right">
        {children}
      </section>
    </div>
  );
}

export default AuthLayout;
