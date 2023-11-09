const UnauthorizedText = () => {
    return (
        <>
            <section className="section">
                <h1>Unauthorized</h1>
                <p>You are not authorized to view this page.</p>
                <p>Maybe sign up/login instead</p>
                <button className="button is-primary">Login</button>
            </section>
        </>
    );
};

export default UnauthorizedText;
