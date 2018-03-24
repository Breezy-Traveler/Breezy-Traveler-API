require_relative 'boot'

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
# require "sprockets/railtie"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module BreezyTravelerApi
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.

    # Load the env variables
    config.before_configuration do
      env_file = File.join(Rails.root, 'config', 'local_env.yml')
      YAML.load(File.open(env_file)).each do |key, value|
        ENV[key.to_s] = value
      end if File.exists?(env_file)
    end

    config.load_defaults 5.1
      config.paperclip_defaults = {
        storage: :s3,
        s3_protocol: :https,
        url: ':s3_domain_url',
        path: '/:class/:attachment/:id_partition/:filename',
        s3_credentials: {
          bucket: ENV.fetch('S3_BUCKET_NAME'),
          access_key_id: ENV.fetch('AWS_ACCESS_KEY_ID'),
          secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY'),
          s3_region: ENV.fetch('AWS_REGION')
        }
      }
    config.api_only = true
  end
end
