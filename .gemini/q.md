const handleCardClick = (id: number) => {
    // Increment views
    fetch(`/api/build/${id}/increment-views`, { method: 'POST' })
      .then(response => {
        if (!response.ok) {
          console.error('Failed to increment views');
        }
      })
      .catch(error => console.error('Error incrementing views:', error));

    const build = allListings.find(l => l.id === id);
    setSelectedBuild(build || null);
  };
---------
ListingSection컴포넌트에서 onCardClick하게 되면 위와 같은 로직도 같이 더해져서 views를 올려줬으면 좋겠어