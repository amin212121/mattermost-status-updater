# Mattermost Status Updater

A simple tool to automatically update your status in Mattermost based on your current activity in Google meet.

## Features

- Automatically updates your Mattermost status based on Google meet session.

## Installation

### Steps

1. **Clone the Repository**  
   First, clone the repository to your local machine:

   ```bash
   git clone https://github.com/amin212121/mattermost-status-updater.git
   cd mattermost-status-updater
   ```

2**Configuration**  
   You need to configure the tool with your Mattermost credentials and preferences:

    - Obtain your Mattermost API token from your Mattermost account settings.


4. **Run the Script**  
   Once the configuration is set up, you can sing in at Google meet. This will update your Mattermost status to the specified `status_text` and `status_emoji`.

## Usage

You can customize and trigger status updates programmatically based on various conditions. The script listens for events, or you can call specific functions to update your status directly.

## Contributing

Contributions are welcome! If you would like to improve this project, feel free to:

- Fork the repository.
- Make your changes.
- Open a pull request.

Please ensure your code is well-documented and follows Python best practices.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Thanks to the Mattermost team for providing an API to interact with the platform.
- Special thanks to the open-source community for their contributions and support.