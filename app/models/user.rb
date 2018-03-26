class User < ApplicationRecord
  validates_presence_of :name
  validates :email, :username, presence: true, uniqueness: true
  attribute :password, :string
  validates :password, length: 6..20, presence: true

  has_many :trips

  has_many :hotels, through: :trips
  has_many :sites, through: :trips

  before_save :encrypt_password
  before_create :generate_token

  def self.authenticate(email, password)
    user = self.find_by_email(email)
    if user && user.password_hash == BCrypt::Engine.hash_secret(password, user.password_salt)
      user
    else
      nil
    end
  end

  def encrypt_password
    if password.present?
      self.password_salt = BCrypt::Engine.generate_salt
      self.password_hash = BCrypt::Engine.hash_secret(password, password_salt)
    end
  end

  # Generates a token for a user
  def generate_token
    token_gen = SecureRandom.hex
    self.token = token_gen
    token_gen
  end
end
