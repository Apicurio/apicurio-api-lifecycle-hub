package io.apicurio.lifecycle.workflows.rest.clients.microcks;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;

public class MicrocksClient {

    private String baseUrl;

    /**
     * Constructor.
     * @param baseUrl
     */
    public MicrocksClient(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    /**
     * @param fileName
     * @param content
     */
    public void upload(String fileName, String content) {
        try {
            // Specify the URL of the server
            String serverUrl = baseUrl + "/artifact/upload";
            URL url = new URL(serverUrl);

            // Create the HttpURLConnection object
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            // Set the request method to POST
            connection.setRequestMethod("POST");

            // Enable input and output streams
            connection.setDoOutput(true);
            connection.setDoInput(true);

            // Set the content type to multipart/form-data
            String boundary = "---------------------------" + System.currentTimeMillis();
            connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);

            // Create the output stream to write data to the server
            OutputStream outputStream = connection.getOutputStream();
            PrintWriter writer = new PrintWriter(new OutputStreamWriter(outputStream, "UTF-8"), true);

            // Add form fields
            writer.append("--" + boundary).append("\r\n");
            writer.append("Content-Disposition: form-data; name=\"mainArtifact\"").append("\r\n");
            writer.append("\r\n");
            writer.append("true").append("\r\n");

            // Add file part
            writer.append("--" + boundary).append("\r\n");
            writer.append("Content-Disposition: form-data; name=\"file\"; filename=\"" + fileName + "\"").append("\r\n");
            writer.append("Content-Type: application/json").append("\r\n");
            writer.append("\r\n");

            writer.append(content);
            
            outputStream.flush();

            // Add the closing boundary
            writer.append("\r\n").append("--" + boundary + "--").append("\r\n");
            writer.close();

            // Get the server's response
            int responseCode = connection.getResponseCode();
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String line;
            StringBuilder response = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();

            // Print the response
            System.out.println("Response Code: " + responseCode);
            System.out.println("Response Message: " + response.toString());

            // Close the connection
            connection.disconnect();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
